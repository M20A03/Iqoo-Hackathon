package com.neuroassist.edge.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

// ══════════════════════════════════════════════════════════════
// PulseEdge-OS Design System (Light Theme)
// Professional, high-contrast clinical interface
// ══════════════════════════════════════════════════════════════

// ── Core Brand Colors ──
val NeuroGreen = Color(0xFF0B301B)         // Primary: Forest green
val NeuroGreenDark = Color(0xFF051A0B)
val NeuroGold = Color(0xFFFFB800)           // Secondary: Warm Gold
val NeuroTeal = Color(0xFF2CA470)           // Accent: Teal
val NeuroRed = Color(0xFFD94111)            // Error: Safety alerts
val NeuroRedDark = Color(0xFF7F1D1D)
val NeuroBlue = Color(0xFF0056B3)           // Info: Vitals, PPG waveform

// ── Surface Colors (Light Mode) ──
val SurfaceDeep = Color(0xFFF8F9FA)         // Main background
val SurfaceDark = Color(0xFFFFFFFF)         // Card backgrounds (Pure White)
val SurfaceMid = Color(0xFFF1F3F5)          // Elevated surfaces
val SurfaceBorder = Color(0xFFE9ECEF)       // Border / divider
val OnSurfacePrimary = Color(0xFF1A1A1A)    // Primary text (Deep Charcoal)
val OnSurfaceSecondary = Color(0xFF4A4A4A)  // Secondary text
val OnSurfaceMuted = Color(0xFF868E96)      // Muted text

// ── Light Color Scheme ──
private val PulseEdgeColorScheme = lightColorScheme(
    primary = NeuroGreen,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFC4F1D5),
    onPrimaryContainer = NeuroGreen,
    secondary = NeuroGold,
    onSecondary = NeuroGreen,
    tertiary = NeuroTeal,
    onTertiary = Color.White,
    error = NeuroRed,
    onError = Color.White,
    background = SurfaceDeep,
    onBackground = OnSurfacePrimary,
    surface = SurfaceDark,
    onSurface = OnSurfacePrimary,
    surfaceVariant = SurfaceMid,
    onSurfaceVariant = OnSurfaceSecondary,
    outline = SurfaceBorder,
    outlineVariant = SurfaceBorder,
)

// ── Typography ──
val NeuroTypography = Typography(
    displayLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Black,
        fontSize = 36.sp,
        lineHeight = 44.sp,
        letterSpacing = (-0.5).sp,
    ),
    headlineLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 28.sp,
        lineHeight = 36.sp,
    ),
    headlineMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 22.sp,
        lineHeight = 28.sp,
    ),
    headlineSmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 18.sp,
        lineHeight = 24.sp,
    ),
    titleLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 18.sp,
        lineHeight = 24.sp,
    ),
    titleMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = 14.sp,
        lineHeight = 20.sp,
        letterSpacing = 0.5.sp,
    ),
    bodyLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 24.sp,
    ),
    bodyMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        lineHeight = 20.sp,
    ),
    bodySmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 12.sp,
        lineHeight = 16.sp,
    ),
    labelLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 12.sp,
        lineHeight = 16.sp,
        letterSpacing = 1.5.sp,
    ),
    labelSmall = TextStyle(
        fontFamily = FontFamily.Monospace,
        fontWeight = FontWeight.Medium,
        fontSize = 10.sp,
        lineHeight = 14.sp,
        letterSpacing = 0.5.sp,
    ),
)

@Composable
fun NeuroAssistTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = PulseEdgeColorScheme,
        typography = NeuroTypography,
        content = content
    )
}
