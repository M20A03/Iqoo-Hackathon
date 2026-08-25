package com.neuroassist.edge.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.neuroassist.edge.NeuroAccessibilityService
import com.neuroassist.edge.data.AppDatabase
import com.neuroassist.edge.data.MedicationLog
import com.neuroassist.edge.data.VitalsLog
import com.neuroassist.edge.medical.AcousticDiagnosticEngine
import com.neuroassist.edge.tracking.GazeTracker
import com.neuroassist.edge.ui.screens.DiagnosticsScreen
import com.neuroassist.edge.ui.screens.ScanScreen
import com.neuroassist.edge.ui.theme.*
import kotlinx.coroutines.flow.flowOn
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    db: AppDatabase,
    gazeTracker: GazeTracker,
    acousticEngine: AcousticDiagnosticEngine,
    isTremorFilteringEnabled: Boolean,
    onToggleTremorFilter: (Boolean) -> Unit,
    onSpeak: (String) -> Unit,
    onSpeakSafety: (com.neuroassist.edge.medical.SafetyCheckResult) -> Unit,
    onCheckAccessibility: () -> Boolean,
    onCheckOverlayPermission: () -> Boolean
) {
    var selectedTab by remember { mutableStateOf(0) }
    val scope = rememberCoroutineScope()
    
    val accessibilityLogs = NeuroAccessibilityService.executionLogs.collectAsStateWithLifecycle(initialValue = "Waiting for service binding...")
    val gazeState by gazeTracker.gazeState.collectAsStateWithLifecycle()
    val gestureState by gazeTracker.gestureState.collectAsStateWithLifecycle()

    var medicationLogs by remember { mutableStateOf(emptyList<MedicationLog>()) }
    var vitalsLogs by remember { mutableStateOf(emptyList<VitalsLog>()) }

    // Load DB records
    LaunchedEffect(selectedTab) {
        scope.launch {
            medicationLogs = db.medicationLogDao().getRecent(0)
            vitalsLogs = db.vitalsLogDao().getAll()
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "⚡ PulseEdge-OS",
                            color = NeuroGreen,
                            fontWeight = FontWeight.Bold,
                            fontFamily = NeuroTypography.headlineLarge.fontFamily
                        )
                        Text(
                            text = "Physical Sensor Diagnostic & Assistive OS",
                            color = NeuroGold,
                            style = NeuroTypography.labelSmall
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = SurfaceDeep)
            )
        },
        bottomBar = {
            NavigationBar(containerColor = SurfaceDark) {
                NavigationBarItem(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    icon = { Icon(Icons.Default.Home, contentDescription = "Dashboard") },
                    label = { Text("Dashboard") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = NeuroGreen,
                        selectedTextColor = NeuroGreen,
                        unselectedIconColor = OnSurfaceMuted,
                        unselectedTextColor = OnSurfaceMuted
                    )
                )
                NavigationBarItem(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    icon = { Icon(Icons.Default.CameraAlt, contentDescription = "Scan Meds") },
                    label = { Text("Scan") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = NeuroGreen,
                        selectedTextColor = NeuroGreen,
                        unselectedIconColor = OnSurfaceMuted,
                        unselectedTextColor = OnSurfaceMuted
                    )
                )
                NavigationBarItem(
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 },
                    icon = { Icon(Icons.Default.Favorite, contentDescription = "Vitals PPG") },
                    label = { Text("Vitals") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = NeuroGreen,
                        selectedTextColor = NeuroGreen,
                        unselectedIconColor = OnSurfaceMuted,
                        unselectedTextColor = OnSurfaceMuted
                    )
                )
                NavigationBarItem(
                    selected = selectedTab == 3,
                    onClick = { selectedTab = 3 },
                    icon = { Icon(Icons.Default.Healing, contentDescription = "Diagnostics") },
                    label = { Text("Clinical") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = NeuroGreen,
                        selectedTextColor = NeuroGreen,
                        unselectedIconColor = OnSurfaceMuted,
                        unselectedTextColor = OnSurfaceMuted
                    )
                )
            }
        },
        containerColor = SurfaceDeep
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize()
                .padding(16.dp)
        ) {
            when (selectedTab) {
                0 -> {
                    // ── Accessibility / Permission Dashboard ──
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .verticalScroll(rememberScrollState()),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        Card(
                            colors = CardDefaults.cardColors(containerColor = SurfaceDark),
                            modifier = Modifier.border(1.dp, SurfaceBorder, RoundedCornerShape(16.dp))
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Text(
                                    text = "System Permissions",
                                    style = NeuroTypography.titleLarge,
                                    color = NeuroGreen
                                )
                                Spacer(modifier = Modifier.height(12.dp))
                                
                                Button(
                                    onClick = { onCheckAccessibility() },
                                    colors = ButtonDefaults.buttonColors(containerColor = NeuroGreen, contentColor = Color.White),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Text("Bind Accessibility Service")
                                }
                                
                                Spacer(modifier = Modifier.height(8.dp))
                                
                                Button(
                                    onClick = { onCheckOverlayPermission() },
                                    colors = ButtonDefaults.buttonColors(containerColor = NeuroGold, contentColor = NeuroGreen),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Text("Enable Floating Gaze Cursor")
                                }

                                Spacer(modifier = Modifier.height(12.dp))
                                HorizontalDivider(color = SurfaceBorder)
                                Spacer(modifier = Modifier.height(12.dp))

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text("Tremor Low-Pass Filter", color = NeuroGreen, style = NeuroTypography.titleMedium)
                                        Text("For Parkinson's / mechanical jitters", color = OnSurfaceSecondary, style = NeuroTypography.labelSmall)
                                    }
                                    Switch(
                                        checked = isTremorFilteringEnabled,
                                        onCheckedChange = onToggleTremorFilter,
                                        colors = SwitchDefaults.colors(checkedThumbColor = NeuroGreen)
                                    )
                                }
                            }
                        }

                        // ── Live Gaze / Gesture Telemetry HUD ──
                        Card(
                            colors = CardDefaults.cardColors(containerColor = SurfaceDark),
                            modifier = Modifier.border(1.dp, SurfaceBorder, RoundedCornerShape(16.dp))
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Text(
                                    text = "Neuro-Tracking Telemetry",
                                    style = NeuroTypography.titleLarge,
                                    color = NeuroGreen
                                )
                                Spacer(modifier = Modifier.height(12.dp))
                                Text("Tracking Status: ${gazeState.statusMessage}", style = NeuroTypography.bodyMedium)
                                Text("Gaze Cursor: X=${String.format("%.2f", gazeState.cursorPosition.x)}, Y=${String.format("%.2f", gazeState.cursorPosition.y)}", style = NeuroTypography.bodySmall, color = OnSurfaceSecondary)

                                Spacer(modifier = Modifier.height(12.dp))
                                HorizontalDivider(color = SurfaceBorder)
                                Spacer(modifier = Modifier.height(12.dp))

                                Text("Active Gestures:", style = NeuroTypography.titleMedium, color = NeuroGold)
                                Spacer(modifier = Modifier.height(8.dp))
                                GestureRow("Smile Trigger", gestureState.smile)
                                GestureRow("Eyebrows Raised", gestureState.eyebrowsRaised)
                                GestureRow("Mouth Open (Scroll)", gestureState.mouthOpen)
                                GestureRow("Sustained Wink Left", gestureState.sustainedWinkLeft)
                                GestureRow("Double Eyebrow Raise (Scan)", gestureState.doubleEyebrowRaise)
                                
                                Spacer(modifier = Modifier.height(12.dp))
                                HorizontalDivider(color = SurfaceBorder)
                                Spacer(modifier = Modifier.height(12.dp))

                                Text("Acoustic Triggers:", style = NeuroTypography.titleMedium, color = NeuroGold)
                                Spacer(modifier = Modifier.height(8.dp))
                                Text("Breath Detection: ACTIVE", style = NeuroTypography.bodySmall, color = NeuroGreen)
                                Text("Puff -> Read Screen", style = NeuroTypography.labelSmall, color = OnSurfaceSecondary)
                            }
                        }

                        // ── Live Accessibility Service Log Output ──
                        Card(
                            colors = CardDefaults.cardColors(containerColor = SurfaceDark),
                            modifier = Modifier.border(1.dp, SurfaceBorder, RoundedCornerShape(16.dp))
                        ) {
                            Column(
                                modifier = Modifier
                                    .padding(16.dp)
                                    .fillMaxWidth()
                            ) {
                                Text(
                                    text = "Accessibility Dispatcher Logs",
                                    style = NeuroTypography.titleLarge,
                                    color = NeuroGreen
                                )
                                Spacer(modifier = Modifier.height(12.dp))
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(120.dp)
                                        .background(Color.Black)
                                        .border(1.dp, SurfaceBorder)
                                        .padding(8.dp)
                                ) {
                                    Text(
                                        text = accessibilityLogs.value,
                                        color = NeuroGreen,
                                        fontFamily = NeuroTypography.labelSmall.fontFamily,
                                        fontSize = 11.sp
                                    )
                                }
                            }
                        }
                    }
                }
                1 -> {
                    ScanScreen(db = db, onSpeak = onSpeak, onSpeakSafety = onSpeakSafety)
                }
                2 -> {
                    VitalsScreen(db = db, onSpeak = onSpeak)
                }
                3 -> {
                    DiagnosticsScreen(acousticEngine = acousticEngine, onSpeak = onSpeak)
                }
            }
        }
    }
}

@Composable
fun GestureRow(label: String, active: Boolean) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(text = label, style = NeuroTypography.bodyMedium)
        Box(
            modifier = Modifier
                .size(12.dp)
                .clip(RoundedCornerShape(6.dp))
                .background(if (active) NeuroGreen else OnSurfaceMuted)
        )
    }
}
