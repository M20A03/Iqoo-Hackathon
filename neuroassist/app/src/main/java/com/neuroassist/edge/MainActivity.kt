package com.neuroassist.edge

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import android.speech.tts.TextToSpeech
import android.util.Log
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.core.content.ContextCompat
import com.neuroassist.edge.data.AppDatabase
import com.neuroassist.edge.input.TremorFilterEngine
import com.neuroassist.edge.input.VoiceCommandEngine
import com.neuroassist.edge.medical.AcousticDiagnosticEngine
import com.neuroassist.edge.sync.ClipboardBridge
import com.neuroassist.edge.sync.TelemetryServer
import com.neuroassist.edge.tracking.BlinkDetector
import com.neuroassist.edge.tracking.GazeTracker
import com.neuroassist.edge.ui.screens.HomeScreen
import com.neuroassist.edge.ui.theme.NeuroAssistTheme
import com.neuroassist.edge.ui.theme.SurfaceDeep
import android.view.MotionEvent
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.util.Locale

class MainActivity : ComponentActivity(), TextToSpeech.OnInitListener {

    companion object {
        private const val TAG = "MainActivity"
    }

    private lateinit var db: AppDatabase
    private lateinit var gazeTracker: GazeTracker
    private lateinit var acousticEngine: AcousticDiagnosticEngine
    private lateinit var blinkDetector: BlinkDetector
    private lateinit var voiceCommandEngine: VoiceCommandEngine
    private lateinit var tremorFilter: TremorFilterEngine
    private lateinit var clipboardBridge: ClipboardBridge
    private lateinit var telemetryServer: TelemetryServer
    private var tts: TextToSpeech? = null
    private var isTtsReady = false

    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val cameraGranted = permissions[Manifest.permission.CAMERA] ?: false
        val audioGranted = permissions[Manifest.permission.RECORD_AUDIO] ?: false

        if (cameraGranted && audioGranted) {
            startSystemEngines()
        } else {
            Toast.makeText(this, "Permissions required for hands-free tracking & audio features", Toast.LENGTH_LONG).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        db = AppDatabase.getDatabase(this)
        gazeTracker = GazeTracker(this)
        acousticEngine = AcousticDiagnosticEngine(
            onBreathTrigger = {
                speakText("Breath trigger detected")
                NeuroAccessibilityService.instance?.executeCommand(
                    VoiceCommandEngine.VoiceCommand("READ_SCREEN")
                )
            },
            onDiagnosticAlert = { alert ->
                speakText(alert)
                Log.w(TAG, "Clinical Alert: $alert")
            }
        )
        blinkDetector = BlinkDetector { gesture ->
            when (gesture) {
                BlinkDetector.BlinkGesture.DOUBLE_BLINK -> {
                    speakText("Double blink click")
                    NeuroAccessibilityService.instance?.performClickAtCursor()
                }
                BlinkDetector.BlinkGesture.SUSTAINED_BLINK -> {
                    speakText("Sustained blink home")
                    NeuroAccessibilityService.instance?.executeCommand(
                        VoiceCommandEngine.VoiceCommand("HOME")
                    )
                }
            }
        }
        voiceCommandEngine = VoiceCommandEngine()
        tremorFilter = TremorFilterEngine()
        clipboardBridge = ClipboardBridge(this, db) { message ->
            speakText(message)
        }
        telemetryServer = TelemetryServer()
        tts = TextToSpeech(this, this)

        checkAndRequestPermissions()

        setContent {
            NeuroAssistTheme {
                val isTremorFilterOn = remember { mutableStateOf(false) }

                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = SurfaceDeep
                ) {
                    HomeScreen(
                        db = db,
                        gazeTracker = gazeTracker,
                        acousticEngine = acousticEngine,
                        isTremorFilteringEnabled = isTremorFilterOn.value,
                        onToggleTremorFilter = { enabled -> 
                            isTremorFilterOn.value = enabled
                            tremorFilter.setEnabled(enabled)
                        },
                        onSpeak = { text -> speakText(text) },
                        onSpeakSafety = { result -> speakSafetyWarning(result) },
                        onCheckAccessibility = { checkAccessibilityEnabled() },
                        onCheckOverlayPermission = { checkOverlayPermission() }
                    )
                }
            }
        }
    }

    override fun dispatchTouchEvent(ev: MotionEvent): Boolean {
        if (::tremorFilter.isInitialized) {
            tremorFilter.filter(ev)
        }
        return super.dispatchTouchEvent(ev)
    }

    private fun checkAndRequestPermissions() {
        val permissionsToRequest = mutableListOf<String>()
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            permissionsToRequest.add(Manifest.permission.CAMERA)
        }
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            permissionsToRequest.add(Manifest.permission.RECORD_AUDIO)
        }

        if (permissionsToRequest.isNotEmpty()) {
            requestPermissionLauncher.launch(permissionsToRequest.toTypedArray())
        } else {
            startSystemEngines()
        }
    }

    private fun startSystemEngines() {
        CoroutineScope(Dispatchers.Main).launch {
            if (android.os.Build.MANUFACTURER.equals("OPPO", ignoreCase = true)) {
                Log.d(TAG, "Oppo device detected. Delaying engine startup by 5s to avoid sensor collision.")
                delay(5000)
            }

            Log.d(TAG, "Starting system engines...")
            telemetryServer.start()

            // --- Neuro-Bridge: Gaze & Gesture Dispatchers ---
            launch {
                // Forward Gaze coordinates
                gazeTracker.gazeState.collect { state ->
                    if (state.isTracking) {
                        NeuroAccessibilityService.instance?.updateCursorPosition(
                            state.cursorPosition.x,
                            state.cursorPosition.y
                        )

                        // Stream to Caregiver HUD
                        telemetryServer.broadcastTelemetry(
                            "{\"type\":\"gaze\", \"x\": ${state.cursorPosition.x}, \"y\": ${state.cursorPosition.y}}"
                        )
                    }
                }
            }

            launch {
                // Stream Acoustic Pathology to Caregiver HUD
                acousticEngine.state.collect { state ->
                    if (state.isRecording && state.detectedPathology != "Normal/Quiet") {
                        telemetryServer.broadcastTelemetry(
                            "{\"type\":\"pathology\", \"value\": \"${state.detectedPathology}\"}"
                        )
                    }
                }
            }

            launch {
                // Forward Gestures (Blink/Smile/etc)
                gazeTracker.gestureState.collect { state ->
                    // Feed higher-level blink detector
                    blinkDetector.update(state.blinkBoth)

                    if (state.smile) {
                        NeuroAccessibilityService.instance?.performClickAtCursor()
                    }
                }
            }

            // --- Hardware Engine Initialization (Safely and Delayed) ---
            launch(Dispatchers.IO) {
                try {
                    // Delay to allow UI to breathe
                    delay(2000)
                    Log.d(TAG, "Initializing GazeTracker (Native MediaPipe)...")
                    gazeTracker.initialize()
                } catch (e: Throwable) {
                    Log.e(TAG, "GazeTracker native crash prevented in MainActivity", e)
                }
            }

            launch(Dispatchers.IO) {
                try {
                    delay(1000)
                    // Start Acoustic Engine (AudioRecord)
                    acousticEngine.start(this)
                } catch (e: Exception) {
                    Log.e(TAG, "Acoustic engine start failed", e)
                }
            }
        }
    }

    private fun checkOverlayPermission(): Boolean {
        if (!Settings.canDrawOverlays(this)) {
            val intent = Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:$packageName")
            )
            startActivity(intent)
            return false
        }
        return true
    }

    private fun checkAccessibilityEnabled(): Boolean {
        val serviceString = "$packageName/${NeuroAccessibilityService::class.java.canonicalName}"
        val enabled = Settings.Secure.getInt(
            contentResolver,
            Settings.Secure.ACCESSIBILITY_ENABLED,
            0
        )
        if (enabled == 1) {
            val settingValue = Settings.Secure.getString(
                contentResolver,
                Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
            )
            if (settingValue != null && settingValue.contains(serviceString)) {
                return true
            }
        }
        
        // Redirect to Accessibility Settings
        Toast.makeText(this, "Enable NeuroAssist in Accessibility Settings", Toast.LENGTH_LONG).show()
        val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
        startActivity(intent)
        return false
    }

    fun speakSafetyWarning(result: com.neuroassist.edge.medical.SafetyCheckResult) {
        if (!isTtsReady) return
        
        CoroutineScope(Dispatchers.Main).launch {
            // 1. Speak English warning
            result.warning?.let {
                tts?.language = Locale.US
                tts?.speak(it, TextToSpeech.QUEUE_FLUSH, null, "safety_en")
                // Wait for English to finish before starting Hindi
                while (tts?.isSpeaking == true) { kotlinx.coroutines.delay(100) }
            }

            // 2. Speak Hindi warning
            result.hindiWarning?.let {
                tts?.language = Locale("hi", "IN")
                tts?.speak(it, TextToSpeech.QUEUE_ADD, null, "safety_hi")
                while (tts?.isSpeaking == true) { kotlinx.coroutines.delay(100) }
            }

            // 3. Speak Kannada warning
            result.kannadaWarning?.let {
                tts?.language = Locale("kn", "IN")
                tts?.speak(it, TextToSpeech.QUEUE_ADD, null, "safety_kn")
            }
            
            // Reset to default
            tts?.language = Locale.US
        }
    }

    fun speakText(text: String, locale: Locale = Locale.US) {
        if (isTtsReady) {
            tts?.language = locale
            tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "neuro_tts")
            Log.d(TAG, "Spoken aloud ($locale): $text")
        } else {
            Log.w(TAG, "TTS not ready yet")
        }
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            // Check availability of required languages
            checkLanguage(Locale.US, "English")
            checkLanguage(Locale("hi", "IN"), "Hindi")
            checkLanguage(Locale("kn", "IN"), "Kannada")
            
            // Default to US English
            tts?.language = Locale.US
            isTtsReady = true
            Log.i(TAG, "TextToSpeech engine ready")
        } else {
            Log.e(TAG, "TextToSpeech initialization failed")
        }
    }

    private fun checkLanguage(locale: Locale, name: String) {
        val result = tts?.isLanguageAvailable(locale)
        if (result == TextToSpeech.LANG_AVAILABLE || result == TextToSpeech.LANG_COUNTRY_AVAILABLE || result == TextToSpeech.LANG_COUNTRY_VAR_AVAILABLE) {
            Log.d(TAG, "$name language is supported and available")
        } else {
            Log.w(TAG, "$name language is not supported or missing data")
        }
    }

    override fun onStart() {
        super.onStart()
        clipboardBridge.start()
    }

    override fun onStop() {
        super.onStop()
        clipboardBridge.stop()
    }

    override fun onDestroy() {
        tts?.stop()
        tts?.shutdown()
        gazeTracker.release()
        acousticEngine.stop()
        telemetryServer.stop()
        super.onDestroy()
    }
}
