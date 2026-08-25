package com.neuroassist.edge.ui.components

import android.content.Context
import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.PixelFormat
import android.os.Build
import android.view.Gravity
import android.view.View
import android.view.WindowManager
import com.neuroassist.edge.ui.theme.NeuroGreen
import com.neuroassist.edge.ui.theme.NeuroGold

/**
 * GazeCursor — Premium floating overlay cursor.
 * 
 * Draws a high-contrast clinical cursor with a pulse effect and center dot.
 * Managed via WindowManager for system-wide accessibility control.
 */
class GazeCursor(private val context: Context) {

    private val windowManager = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager
    private var overlayView: CursorView? = null
    private var params: WindowManager.LayoutParams? = null
    private var isShowing = false

    fun show() {
        if (isShowing) return

        overlayView = CursorView(context)
        
        val layoutType = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        } else {
            @Suppress("DEPRECATION")
            WindowManager.LayoutParams.TYPE_PHONE
        }

        params = WindowManager.LayoutParams(
            120, 120, // Cursor size
            layoutType,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                    WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE or
                    WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP or Gravity.START
            x = 0
            y = 0
        }

        try {
            windowManager.addView(overlayView, params)
            isShowing = true
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun updatePosition(normalizedX: Float, normalizedY: Float) {
        if (!isShowing) return
        val view = overlayView ?: return
        val layoutParams = params ?: return

        val displayMetrics = context.resources.displayMetrics
        val screenWidth = displayMetrics.widthPixels
        val screenHeight = displayMetrics.heightPixels

        // Smoothing could be added here or in the tracker engine
        layoutParams.x = (normalizedX * screenWidth).toInt() - (120 / 2)
        layoutParams.y = (normalizedY * screenHeight).toInt() - (120 / 2)

        try {
            windowManager.updateViewLayout(view, layoutParams)
        } catch (e: Exception) {}
    }

    fun triggerClickAnimation() {
        overlayView?.animateClick()
    }

    fun hide() {
        if (!isShowing) return
        try {
            windowManager.removeView(overlayView)
        } catch (e: Exception) {}
        overlayView = null
        params = null
        isShowing = false
    }

    /**
     * Custom View to draw a medical-grade cursor.
     */
    private class CursorView(context: Context) : View(context) {
        private val paintInner = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = 0xFFc4f1d5.toInt() // NeuroGreen
            style = Paint.Style.FILL
        }
        private val paintOuter = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = 0xFFc4f1d5.toInt()
            style = Paint.Style.STROKE
            strokeWidth = 4f
            alpha = 150
        }
        private val paintPulse = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = 0xFFFFB800.toInt() // NeuroGold
            style = Paint.Style.STROKE
            strokeWidth = 2f
            alpha = 0
        }

        private var pulseRadius = 0f
        private var isClicking = false

        fun animateClick() {
            isClicking = true
            invalidate()
            postDelayed({
                isClicking = false
                invalidate()
            }, 200)
        }

        override fun onDraw(canvas: Canvas) {
            val centerX = width / 2f
            val centerY = height / 2f
            
            // Outer Ring
            canvas.drawCircle(centerX, centerY, 30f, paintOuter)
            
            // Inner Dot
            val dotRadius = if (isClicking) 15f else 10f
            canvas.drawCircle(centerX, centerY, dotRadius, paintInner)
            
            // Pulse Effect (if clicking)
            if (isClicking) {
                canvas.drawCircle(centerX, centerY, 45f, paintPulse.apply { alpha = 200 })
            }
        }
    }
}
