package com.neuroassist.edge.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.rounded.Visibility
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.neuroassist.edge.medical.AcousticDiagnosticEngine
import com.neuroassist.edge.medical.TriageEngine
import com.neuroassist.edge.ui.theme.*

@Composable
fun DiagnosticsScreen(
    acousticEngine: AcousticDiagnosticEngine,
    onSpeak: (String) -> Unit
) {
    val acousticState by acousticEngine.state.collectAsStateWithLifecycle()
    val scrollState = rememberScrollState()
    
    var showTriageDialog by remember { mutableStateOf(false) }
    val triageEngine = remember { TriageEngine() }

    if (showTriageDialog) {
        TriageQuizDialog(
            engine = triageEngine,
            onDismiss = { showTriageDialog = false },
            onSpeak = onSpeak
        )
    }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .verticalScroll(scrollState),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = "Clinical Diagnostic Suite",
            style = NeuroTypography.headlineSmall,
            color = NeuroGreen
        )

        // ── 1. Acoustic Pulmonary HUD ──
        Card(
            colors = CardDefaults.cardColors(containerColor = SurfaceDark),
            modifier = Modifier.border(1.dp, SurfaceBorder, RoundedCornerShape(16.dp))
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Acoustic Stethoscope",
                        style = NeuroTypography.titleMedium,
                        color = NeuroGold
                    )
                    Switch(
                        checked = acousticState.isRecording,
                        onCheckedChange = { 
                            // Controlled by MainActivity startEngines
                        },
                        enabled = false // Managed system-wide
                    )
                }
                
                Spacer(modifier = Modifier.height(12.dp))
                
                // Frequency Spectrogram Visualization (Simulated bars)
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(100.dp)
                        .background(Color.Black)
                        .padding(8.dp),
                    contentAlignment = Alignment.BottomStart
                ) {
                    Row(
                        modifier = Modifier.fillMaxSize(),
                        horizontalArrangement = Arrangement.spacedBy(2.dp),
                        verticalAlignment = Alignment.Bottom
                    ) {
                        repeat(20) { index ->
                            val height = if (acousticState.isRecording) {
                                (acousticState.currentAmplitude / 32767f * 100f).coerceIn(5f, 100f) * (0.5f + (index % 5) / 10f)
                            } else 2f
                            
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .height(height.dp)
                                    .background(if (height > 60) NeuroRed else NeuroGreen)
                            )
                        }
                    }
                }
                
                Spacer(modifier = Modifier.height(12.dp))
                
                Text(
                    text = "Respiratory Signal: ${acousticState.detectedPathology}",
                    color = if (acousticState.detectedPathology.contains("Wheezing")) NeuroRed else OnSurfacePrimary,
                    style = NeuroTypography.bodyMedium,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "Peak Frequency: ${acousticState.frequencyHint}",
                    color = OnSurfaceSecondary,
                    style = NeuroTypography.labelSmall
                )
            }
        }

        // ── 2. Optical Biomarker Scanning ──
        Card(
            colors = CardDefaults.cardColors(containerColor = SurfaceDark),
            modifier = Modifier.border(1.dp, SurfaceBorder, RoundedCornerShape(16.dp))
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "Optical Biomarker Engine",
                    style = NeuroTypography.titleMedium,
                    color = NeuroGold
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Analyze Hemoglobin (Anemia) or Bilirubin (Jaundice) via eyelid/sclera scan.",
                    style = NeuroTypography.bodySmall,
                    color = OnSurfaceSecondary
                )
                
                Spacer(modifier = Modifier.height(12.dp))
                
                Button(
                    onClick = { /* Launch specialized macro camera session */ },
                    colors = ButtonDefaults.buttonColors(containerColor = NeuroGreen),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(Icons.Rounded.Visibility, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Start Optical Bio-Scan", color = SurfaceDeep)
                }
            }
        }

        // ── 3. Rural Health: Generic Cost Saver ──
        Card(
            colors = CardDefaults.cardColors(containerColor = SurfaceDark),
            modifier = Modifier.border(1.dp, SurfaceBorder, RoundedCornerShape(16.dp))
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "Jan Aushadhi Cost Saver",
                    style = NeuroTypography.titleMedium,
                    color = NeuroGold
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Scan any branded medicine to find its low-cost government generic equivalent.",
                    style = NeuroTypography.bodySmall,
                    color = OnSurfaceSecondary
                )
                
                Spacer(modifier = Modifier.height(12.dp))
                
                // Generic Savings Table (Mockup)
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color.Black.copy(alpha = 0.3f))
                        .padding(8.dp)
                ) {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Branded (Avg)", color = OnSurfaceMuted, style = NeuroTypography.labelSmall)
                        Text("Generic (Jan Aushadhi)", color = NeuroGreen, style = NeuroTypography.labelSmall)
                    }
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("₹ 180.00", color = OnSurfacePrimary, style = NeuroTypography.titleMedium)
                        Text("₹ 34.50", color = NeuroGreen, style = NeuroTypography.titleMedium, fontWeight = FontWeight.Black)
                    }
                }
            }
        }

        // ── 4. Clinical Triage Flow ──
        Card(
            colors = CardDefaults.cardColors(containerColor = SurfaceDark),
            modifier = Modifier.border(1.dp, NeuroGreen.copy(alpha = 0.5f), RoundedCornerShape(16.dp))
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "WHO/ICMR Symptom Triage",
                    style = NeuroTypography.titleMedium,
                    color = NeuroGreen
                )
                Spacer(modifier = Modifier.height(12.dp))
                
                Text(
                    text = "Offline triage guides for rural primary health care.",
                    style = NeuroTypography.bodySmall,
                    color = OnSurfaceSecondary
                )
                
                Spacer(modifier = Modifier.height(8.dp))
                
                OutlinedButton(
                    onClick = { showTriageDialog = true },
                    modifier = Modifier.fillMaxWidth(),
                    border = BorderStroke(1.dp, NeuroGreen)
                ) {
                    Text("Begin Respiratory Triage Quiz", color = NeuroGreen)
                }
            }
        }
    }
}

@Composable
fun TriageQuizDialog(
    engine: TriageEngine,
    onDismiss: () -> Unit,
    onSpeak: (String) -> Unit
) {
    var step by remember { mutableStateOf(0) }
    var fastBreathing by remember { mutableStateOf(false) }
    var chestIndrawing by remember { mutableStateOf(false) }
    var unableToDrink by remember { mutableStateOf(false) }
    
    val result = if (step > 2) engine.evaluateRespiratory(fastBreathing, chestIndrawing, unableToDrink, false, false) else null

    Dialog(onDismissRequest = onDismiss) {
        Card(
            colors = CardDefaults.cardColors(containerColor = SurfaceDeep),
            modifier = Modifier.fillMaxWidth().padding(16.dp).border(2.dp, NeuroGreen, RoundedCornerShape(16.dp))
        ) {
            Column(modifier = Modifier.padding(24.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                if (step <= 2) {
                    Text("Rural Triage Quiz", color = NeuroGold, style = NeuroTypography.titleLarge)
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    val question = when(step) {
                        0 -> "Is the patient breathing faster than normal?"
                        1 -> "Is there chest in-drawing while breathing?"
                        else -> "Is the patient unable to drink or breastfeed?"
                    }
                    
                    Text(question, color = Color.White, style = NeuroTypography.bodyLarge, textAlign = androidx.compose.ui.text.style.TextAlign.Center)
                    Spacer(modifier = Modifier.height(24.dp))
                    
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                        Button(
                            onClick = { 
                                when(step) {
                                    0 -> fastBreathing = true
                                    1 -> chestIndrawing = true
                                    2 -> unableToDrink = true
                                }
                                step++
                            },
                            modifier = Modifier.weight(1f),
                            colors = ButtonDefaults.buttonColors(containerColor = NeuroGreen)
                        ) { Text("YES", color = SurfaceDeep) }
                        
                        Button(
                            onClick = { step++ },
                            modifier = Modifier.weight(1f),
                            colors = ButtonDefaults.buttonColors(containerColor = NeuroRedDark)
                        ) { Text("NO", color = Color.White) }
                    }
                } else {
                    result?.let {
                        Text("Triage Result", color = NeuroGreen, style = NeuroTypography.titleLarge)
                        Spacer(modifier = Modifier.height(16.dp))
                        
                        Box(modifier = Modifier.fillMaxWidth().background(if (it.urgency == TriageEngine.Urgency.RED) NeuroRedDark else NeuroGreenDark.copy(alpha = 0.5f)).padding(16.dp)) {
                            Text(it.actionRequired, color = Color.White, fontWeight = FontWeight.Black)
                        }
                        
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(it.recommendation, color = Color.White, style = NeuroTypography.bodyMedium)
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(it.hindiAdvice, color = NeuroGold, style = NeuroTypography.bodySmall)
                        
                        Spacer(modifier = Modifier.height(24.dp))
                        Button(onClick = onDismiss, modifier = Modifier.fillMaxWidth(), colors = ButtonDefaults.buttonColors(containerColor = NeuroGreen)) {
                            Text("DONE", color = SurfaceDeep)
                        }
                        
                        LaunchedEffect(Unit) {
                            onSpeak(it.recommendation + ". " + it.hindiAdvice)
                        }
                    }
                }
            }
        }
    }
}
