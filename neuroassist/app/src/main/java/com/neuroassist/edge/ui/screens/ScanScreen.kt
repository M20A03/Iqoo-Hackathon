package com.neuroassist.edge.ui.screens

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Log
import android.view.ViewGroup
import android.widget.Toast
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageCapture
import androidx.camera.core.ImageCaptureException
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import com.neuroassist.edge.data.AppDatabase
import com.neuroassist.edge.data.MedicationLog
import com.neuroassist.edge.medical.OcrPipeline
import com.neuroassist.edge.medical.OpticalBiomarkerEngine
import com.neuroassist.edge.medical.SafetyCheckResult
import com.neuroassist.edge.medical.SafetyInterceptor
import com.neuroassist.edge.ui.theme.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.io.ByteArrayOutputStream
import java.io.File
import java.nio.ByteBuffer
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

@Composable
fun ScanScreen(
    db: AppDatabase,
    onSpeak: (String) -> Unit,
    onSpeakSafety: (SafetyCheckResult) -> Unit
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    val scope = rememberCoroutineScope()

    var isScanning by remember { mutableStateOf(false) }
    var scanMode by remember { mutableStateOf("OCR") } // "OCR" or "BIO"
    var scanResult by remember { mutableStateOf<SafetyCheckResult?>(null) }
    var bioResult by remember { mutableStateOf<OpticalBiomarkerEngine.BiomarkerResult?>(null) }
    var recentScans by remember { mutableStateOf(emptyList<MedicationLog>()) }

    // CameraX configurations
    val imageCapture = remember { ImageCapture.Builder().build() }
    val cameraExecutor: ExecutorService = remember { Executors.newSingleThreadExecutor() }

    // Room DB helper
    val medLogDao = db.medicationLogDao()
    val safetyInterceptor = remember { SafetyInterceptor(medLogDao) }
    val ocrPipeline = remember { OcrPipeline() }
    val bioEngine = remember { OpticalBiomarkerEngine() }

    // Reload scan logs
    fun reloadLogs() {
        scope.launch(Dispatchers.IO) {
            recentScans = medLogDao.getRecent(0)
        }
    }

    LaunchedEffect(Unit) {
        reloadLogs()
    }

    DisposableEffect(Unit) {
        onDispose {
            cameraExecutor.shutdown()
        }
    }

    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = if (scanMode == "OCR") "Rear-Camera Drug Scanner" else "Optical Biomarker Scanner",
            style = NeuroTypography.headlineMedium,
            color = NeuroGreen
        )

        // Mode Selector
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.CenterVertically
        ) {
            FilterChip(
                selected = scanMode == "OCR",
                onClick = { scanMode = "OCR" },
                label = { Text("Drug OCR") },
                colors = FilterChipDefaults.filterChipColors(selectedContainerColor = NeuroGreen)
            )
            Spacer(modifier = Modifier.width(8.dp))
            FilterChip(
                selected = scanMode == "BIO",
                onClick = { scanMode = "BIO" },
                label = { Text("Biomarker") },
                colors = FilterChipDefaults.filterChipColors(selectedContainerColor = NeuroGreen)
            )
        }

        // Camera Preview window
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(300.dp)
                .clip(RoundedCornerShape(16.dp))
                .border(2.dp, NeuroGreen, RoundedCornerShape(16.dp))
        ) {
            AndroidView(
                factory = { ctx ->
                    PreviewView(ctx).apply {
                        scaleType = PreviewView.ScaleType.FILL_CENTER
                        layoutParams = ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.MATCH_PARENT
                        )
                        
                        // Bind camera lifecycle
                        val cameraProviderFuture = ProcessCameraProvider.getInstance(ctx)
                        cameraProviderFuture.addListener({
                            val cameraProvider = cameraProviderFuture.get()
                            val preview = Preview.Builder().build().also {
                                it.setSurfaceProvider(surfaceProvider)
                            }

                            val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA
                            try {
                                cameraProvider.unbindAll()
                                cameraProvider.bindToLifecycle(
                                    lifecycleOwner,
                                    cameraSelector,
                                    preview,
                                    imageCapture
                                )
                            } catch (e: Exception) {
                                Log.e("CameraPreview", "Camera binding failed", e)
                            }
                        }, ContextCompat.getMainExecutor(ctx))
                    }
                },
                modifier = Modifier.fillMaxSize()
            )
            
            if (isScanning) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color.Black.copy(alpha = 0.5f)),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(color = NeuroGreen)
                }
            }
        }

        // Trigger Button
        Button(
            onClick = {
                if (isScanning) return@Button
                isScanning = true
                
                // Capture Image
                imageCapture.takePicture(
                    cameraExecutor,
                    object : ImageCapture.OnImageCapturedCallback() {
                        override fun onCaptureSuccess(imageProxy: androidx.camera.core.ImageProxy) {
                            super.onCaptureSuccess(imageProxy)
                            val bitmap = imageProxyToBitmap(imageProxy)
                            imageProxy.close()

                            if (bitmap != null) {
                                scope.launch {
                                    if (scanMode == "OCR") {
                                        // 1. Run ML Kit offline OCR
                                        val text = ocrPipeline.recognizeText(bitmap)
                                        
                                        // 2. Perform CDSCO Safety checks
                                        val result = safetyInterceptor.checkSafety(text)
                                        scanResult = result
                                        bioResult = null

                                        // 3. Persist Log
                                        val isSafe = result.isSafe
                                        val medName = result.medication?.name ?: "Unknown Medication"
                                        val category = result.medication?.category ?: "Unknown Category"
                                        
                                        db.medicationLogDao().insert(
                                            MedicationLog(
                                                name = medName,
                                                category = category,
                                                timestamp = System.currentTimeMillis(),
                                                isSafe = isSafe,
                                                warning = result.warning ?: result.hindiWarning
                                            )
                                        )
                                        
                                        // 4. TTS
                                        if (!isSafe || result.medication != null) {
                                            onSpeakSafety(result)
                                        } else {
                                            onSpeak("Offline scan complete. Medication could not be matched.")
                                        }
                                    } else {
                                        // Bio-Scan Mode (Sclera/Eyelid)
                                        // For demo, we analyze both and pick the one with higher indicator confidence
                                        val sclera = bioEngine.analyzeSclera(bitmap)
                                        val eyelid = bioEngine.analyzeConjunctiva(bitmap)
                                        
                                        val result = if (sclera.probability > eyelid.probability) sclera else eyelid
                                        bioResult = result
                                        scanResult = null
                                        
                                        onSpeak(result.indicator + ". " + result.recommendation)
                                        onSpeak(result.hindiWarning)
                                    }

                                    isScanning = false
                                    reloadLogs()
                                }
                            } else {
                                isScanning = false
                            }
                        }

                        override fun onError(exception: ImageCaptureException) {
                            super.onError(exception)
                            isScanning = false
                            Log.e("ScanScreen", "Image capture failed", exception)
                        }
                    }
                )
            },
            colors = ButtonDefaults.buttonColors(containerColor = NeuroGreen, contentColor = SurfaceDeep),
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("📸 Capture & Scan Blister Pack", fontWeight = FontWeight.Bold)
        }

        // Bio-Scan Results Container
        bioResult?.let { result ->
            Card(
                colors = CardDefaults.cardColors(
                    containerColor = if (result.probability > 0.5) NeuroRedDark.copy(alpha = 0.5f) else NeuroGreenDark.copy(alpha = 0.3f)
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(2.dp, if (result.probability > 0.5) NeuroRed else NeuroGreen, RoundedCornerShape(12.dp))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "🧬 BIOMARKER: ${result.type}",
                        color = if (result.probability > 0.5) NeuroRed else NeuroGreen,
                        style = NeuroTypography.titleLarge
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(text = "Indicator: ${result.indicator}", color = Color.White, style = NeuroTypography.bodyMedium, fontWeight = FontWeight.Bold)
                    Text(text = result.recommendation, color = OnSurfaceSecondary, style = NeuroTypography.bodySmall)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(text = "Advice: ${result.hindiWarning}", color = NeuroGold, style = NeuroTypography.labelSmall)
                }
            }
        }

        // Safety Warnings Container
        scanResult?.let { result ->
            val med = result.medication
            if (!result.isSafe) {
                Card(
                    colors = CardDefaults.cardColors(containerColor = NeuroRedDark.copy(alpha = 0.5f)),
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(2.dp, NeuroRed, RoundedCornerShape(12.dp))
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "🚨 SAFETY INTERCEPT ALERT",
                            color = NeuroRed,
                            style = NeuroTypography.titleLarge
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(text = result.warning ?: "", color = Color.White, style = NeuroTypography.bodyMedium)
                        Text(text = result.hindiWarning ?: "", color = OnSurfaceSecondary, style = NeuroTypography.bodySmall)
                    }
                }
            } else if (med != null) {
                Card(
                    colors = CardDefaults.cardColors(containerColor = NeuroGreenDark.copy(alpha = 0.3f)),
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, NeuroGreen, RoundedCornerShape(12.dp))
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "✅ Medication: ${med.name}",
                            color = NeuroGreen,
                            style = NeuroTypography.titleLarge
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(text = "Salt: ${med.salt}", color = OnSurfacePrimary, style = NeuroTypography.bodyMedium)
                        
                        // Generic Savings Banner
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 8.dp)
                                .background(NeuroGold.copy(alpha = 0.2f))
                                .border(1.dp, NeuroGold)
                                .padding(8.dp)
                        ) {
                            Column {
                                Text("Jan Aushadhi Generic Saver", color = NeuroGold, style = NeuroTypography.labelSmall, fontWeight = FontWeight.Bold)
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                    Text("Branded: ₹${med.brandedPrice}", color = Color.White, style = NeuroTypography.bodySmall)
                                    Text("Generic: ₹${med.janAushadhiPrice}", color = NeuroGreen, style = NeuroTypography.titleMedium, fontWeight = FontWeight.Black)
                                }
                                Text("Potential Savings: ₹${med.brandedPrice - med.janAushadhiPrice}", color = NeuroGreen, style = NeuroTypography.labelSmall)
                            }
                        }

                        Text(text = "Instructions: ${med.warning}", color = OnSurfaceSecondary, style = NeuroTypography.bodySmall)
                    }
                }
            }
        }

        // Recent Scans History Log
        Column(modifier = Modifier.fillMaxWidth()) {
            Text(
                text = "Medication Log (Last 24h)",
                style = NeuroTypography.titleLarge,
                color = NeuroGreen
            )
            Spacer(modifier = Modifier.height(8.dp))
            
            LazyColumn(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
                    .background(SurfaceDark)
                    .border(1.dp, SurfaceBorder)
                    .padding(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(recentScans) { log ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Color.Black.copy(alpha = 0.3f))
                            .border(
                                1.dp,
                                if (log.isSafe) SurfaceBorder else NeuroRed.copy(alpha = 0.5f),
                                RoundedCornerShape(8.dp)
                            )
                            .padding(8.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text(
                                text = log.name,
                                color = if (log.isSafe) NeuroGreen else NeuroRed,
                                style = NeuroTypography.bodyMedium
                            )
                            Text(text = log.category, style = NeuroTypography.bodySmall, color = OnSurfaceMuted)
                        }
                        Text(
                            text = if (log.isSafe) "SAFE" else "ALERT",
                            color = if (log.isSafe) NeuroGreen else NeuroRed,
                            style = NeuroTypography.labelLarge
                        )
                    }
                }
            }
        }
    }
}

// Convert CameraX ImageProxy to Bitmap
private fun imageProxyToBitmap(image: androidx.camera.core.ImageProxy): Bitmap? {
    val planeProxy = image.planes[0]
    val buffer: ByteBuffer = planeProxy.buffer
    val bytes = ByteArray(buffer.remaining())
    buffer.get(bytes)
    return BitmapFactory.decodeByteArray(bytes, 0, bytes.size)
}
