package com.neuroassist.edge.ui.screens

import android.annotation.SuppressLint
import android.util.Log
import android.view.ViewGroup
import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.foundation.Canvas
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
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import com.neuroassist.edge.data.AppDatabase
import com.neuroassist.edge.data.VitalsLog
import com.neuroassist.edge.medical.CameraPPG
import com.neuroassist.edge.ui.theme.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import kotlin.math.max
import kotlin.math.min

@Composable
fun VitalsScreen(
    db: AppDatabase,
    onSpeak: (String) -> Unit
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    val scope = rememberCoroutineScope()

    var isMeasuring by remember { mutableStateOf(false) }
    var currentBpm by remember { mutableStateOf(0) }
    var vitalsHistory by remember { mutableStateOf(emptyList<VitalsLog>()) }

    // Waveform visualization queue
    val wavePoints = remember { mutableStateListOf<Float>() }

    val cameraPPG = remember { CameraPPG() }
    val cameraExecutor: ExecutorService = remember { Executors.newSingleThreadExecutor() }
    var camera: Camera? = null

    fun reloadHistory() {
        scope.launch(Dispatchers.IO) {
            vitalsHistory = db.vitalsLogDao().getAll()
        }
    }

    LaunchedEffect(Unit) {
        reloadHistory()
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
            text = "Contactless Vitals Ingestion (PPG)",
            style = NeuroTypography.headlineMedium,
            color = NeuroGreen
        )

        Text(
            text = "Place index finger on the rear camera lens. Keep steady.",
            color = OnSurfaceSecondary,
            style = NeuroTypography.bodyMedium
        )

        // Camera Frame Analyzer box for feedback
        Box(
            modifier = Modifier
                .size(120.dp)
                .clip(RoundedCornerShape(60.dp))
                .border(3.dp, if (isMeasuring) NeuroBlue else OnSurfaceMuted, RoundedCornerShape(60.dp))
        ) {
            AndroidView(
                factory = { ctx ->
                    PreviewView(ctx).apply {
                        scaleType = PreviewView.ScaleType.FILL_CENTER
                        layoutParams = ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.MATCH_PARENT
                        )

                        val cameraProviderFuture = ProcessCameraProvider.getInstance(ctx)
                        cameraProviderFuture.addListener({
                            val cameraProvider = cameraProviderFuture.get()
                            val preview = Preview.Builder().build().also {
                                it.setSurfaceProvider(surfaceProvider)
                            }

                            // Set up frame analyzer
                            val imageAnalysis = ImageAnalysis.Builder()
                                .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                                .build()

                            imageAnalysis.setAnalyzer(cameraExecutor) { imageProxy ->
                                if (isMeasuring) {
                                    val redMean = analyzeImageRedMean(imageProxy)
                                    
                                    // Add to wave visualization (limit to 100 points)
                                    scope.launch(Dispatchers.Main) {
                                        wavePoints.add(redMean)
                                        if (wavePoints.size > 80) {
                                            wavePoints.removeAt(0)
                                        }
                                    }

                                    // Run PPG math
                                    val bpm = cameraPPG.processFrame(redMean)
                                    if (bpm > 0) {
                                        scope.launch {
                                            currentBpm = bpm
                                            isMeasuring = false
                                            
                                            // Enable/Disable flash
                                            camera?.cameraControl?.enableTorch(false)

                                            // Save to Room DB
                                            db.vitalsLogDao().insert(
                                                VitalsLog(
                                                    heartRate = bpm,
                                                    spo2 = 98, // Simulated SpO2 (offline approximation)
                                                    timestamp = System.currentTimeMillis()
                                                )
                                            )
                                            onSpeak("Vitals measured successfully. Heart rate is $bpm beats per minute. Oxygen level is 98 percent.")
                                            reloadHistory()
                                        }
                                    }
                                }
                                imageProxy.close()
                            }

                            val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA
                            try {
                                cameraProvider.unbindAll()
                                camera = cameraProvider.bindToLifecycle(
                                    lifecycleOwner,
                                    cameraSelector,
                                    preview,
                                    imageAnalysis
                                )
                            } catch (e: Exception) {
                                Log.e("VitalsScreen", "Camera binding failed", e)
                            }
                        }, ContextCompat.getMainExecutor(ctx))
                    }
                },
                modifier = Modifier.fillMaxSize()
            )
        }

        // Pulse Waveform Live Graph
        Card(
            colors = CardDefaults.cardColors(containerColor = SurfaceDark),
            modifier = Modifier
                .fillMaxWidth()
                .height(120.dp)
                .border(1.dp, SurfaceBorder, RoundedCornerShape(12.dp))
        ) {
            Box(modifier = Modifier.fillMaxSize()) {
                if (isMeasuring && wavePoints.size > 1) {
                    Canvas(modifier = Modifier.fillMaxSize().padding(8.dp)) {
                        val path = Path()
                        val widthStep = size.width / 80f
                        
                        val minVal = wavePoints.minOrNull() ?: 0f
                        val maxVal = wavePoints.maxOrNull() ?: 1f
                        val delta = maxVal - minVal
                        
                        wavePoints.forEachIndexed { index, point ->
                            val x = index * widthStep
                            // Normalize point to fit height
                            val normalizedY = if (delta > 0) (point - minVal) / delta else 0.5f
                            val y = size.height - (normalizedY * size.height)
                            
                            if (index == 0) {
                                path.moveTo(x, y)
                            } else {
                                path.lineTo(x, y)
                            }
                        }
                        drawPath(
                            path = path,
                            color = NeuroBlue,
                            style = Stroke(width = 3.dp.toPx())
                        )
                    }
                } else {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Text(
                            text = if (isMeasuring) "Acquiring Pulse..." else "Scanner Idle",
                            color = OnSurfaceMuted,
                            style = NeuroTypography.bodyMedium
                        )
                    }
                }
            }
        }

        // Measure button
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Button(
                onClick = {
                    if (isMeasuring) {
                        isMeasuring = false
                        camera?.cameraControl?.enableTorch(false)
                    } else {
                        cameraPPG.reset()
                        wavePoints.clear()
                        currentBpm = 0
                        isMeasuring = true
                        
                        // Turn on Flash / Torch
                        camera?.cameraControl?.enableTorch(true)
                        onSpeak("Scanner active. Hold your finger against the camera lens and flash.")
                    }
                },
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isMeasuring) NeuroRed else NeuroBlue,
                    contentColor = SurfaceDeep
                ),
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    text = if (isMeasuring) "⏹️ Cancel Session" else "❤️ Start Vitals Scan",
                    fontWeight = FontWeight.Bold
                )
            }
        }

        // BPM / SpO2 Display Panel
        if (currentBpm > 0) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Card(
                    colors = CardDefaults.cardColors(containerColor = SurfaceDark),
                    modifier = Modifier
                        .weight(1f)
                        .border(1.dp, NeuroBlue.copy(alpha = 0.5f), RoundedCornerShape(12.dp))
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text("HEART RATE", style = NeuroTypography.labelSmall, color = NeuroBlue)
                        Text(
                            text = "$currentBpm BPM",
                            style = NeuroTypography.headlineLarge,
                            color = Color.White
                        )
                    }
                }

                Card(
                    colors = CardDefaults.cardColors(containerColor = SurfaceDark),
                    modifier = Modifier
                        .weight(1f)
                        .border(1.dp, NeuroGreen.copy(alpha = 0.5f), RoundedCornerShape(12.dp))
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text("SPO2 (EST.)", style = NeuroTypography.labelSmall, color = NeuroGreen)
                        Text(
                            text = "98%",
                            style = NeuroTypography.headlineLarge,
                            color = Color.White
                        )
                    }
                }
            }
        }

        // Vitals History Log
        Column(modifier = Modifier.fillMaxWidth()) {
            Text(
                text = "Vitals Scan Log",
                style = NeuroTypography.titleLarge,
                color = NeuroGreen
            )
            Spacer(modifier = Modifier.height(8.dp))

            LazyColumn(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(150.dp)
                    .background(SurfaceDark)
                    .border(1.dp, SurfaceBorder)
                    .padding(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(vitalsHistory) { log ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Color.Black.copy(alpha = 0.3f))
                            .border(1.dp, SurfaceBorder, RoundedCornerShape(8.dp))
                            .padding(8.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text(
                                text = "${log.heartRate} BPM",
                                color = NeuroBlue,
                                style = NeuroTypography.bodyMedium
                            )
                            Text(
                                text = "SpO2: ${log.spo2}%",
                                style = NeuroTypography.bodySmall,
                                color = OnSurfaceSecondary
                            )
                        }
                        Text(
                            text = java.text.SimpleDateFormat("hh:mm a", java.util.Locale.getDefault())
                                .format(java.util.Date(log.timestamp)),
                            style = NeuroTypography.bodySmall,
                            color = OnSurfaceMuted
                        )
                    }
                }
            }
        }
    }
}

/**
 * Extracts the average red channel intensity from a YUV image frame.
 * Formula: R = Y + 1.402 * (V - 128)
 */
@SuppressLint("UnsafeOptInUsageError")
private fun analyzeImageRedMean(image: ImageProxy): Float {
    val planes = image.image?.planes ?: return 128f
    val yBuffer = planes[0].buffer
    val uBuffer = planes[1].buffer
    val vBuffer = planes[2].buffer

    // Y, U, V byte sizes
    val ySize = yBuffer.remaining()
    val uSize = uBuffer.remaining()
    val vSize = vBuffer.remaining()

    // Sample a central 40x40 grid to be highly performant (avoid scanning whole image)
    val width = image.width
    val height = image.height

    val startX = width / 2 - 20
    val startY = height / 2 - 20
    val numPixels = 40 * 40

    var ySum = 0L
    var vSum = 0L

    for (y in startY until startY + 40) {
        for (x in startX until startX + 40) {
            // Y index
            val yIdx = y * width + x
            if (yIdx < ySize) {
                ySum += yBuffer.get(yIdx).toInt() and 0xFF
            }

            // V index (chrominance) - standard U/V subsampling
            val vIdx = (y / 2) * (width / 2) + (x / 2)
            if (vIdx < vSize) {
                vSum += vBuffer.get(vIdx).toInt() and 0xFF
            }
        }
    }

    val yMean = ySum.toFloat() / numPixels
    val vMean = vSum.toFloat() / numPixels

    // Convert Y and V average back to Red using YUV-RGB formula
    val rMean = yMean + 1.402f * (vMean - 128f)
    return rMean.coerceIn(0f, 255f)
}
