package com.neuroassist.edge

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.GestureDescription
import android.content.Intent
import android.graphics.Path
import android.graphics.Rect
import android.os.Bundle
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import com.neuroassist.edge.input.VoiceCommandEngine.VoiceCommand
import com.neuroassist.edge.ui.components.GazeCursor
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.asSharedFlow

/**
 * NeuroAccessibilityService — Core system integration layer.
 *
 * Implements a real Android AccessibilityService. It acts as the execution bridge
 * that translates parsed gaze/blink/voice/breath commands into actual OS-level
 * gestures, scrolls, keystrokes, and window navigation.
 */
class NeuroAccessibilityService : AccessibilityService() {

    companion object {
        private const val TAG = "NeuroAccessibility"
        
        @Volatile
        var instance: NeuroAccessibilityService? = null
            private set

        private val _executionLogs = MutableSharedFlow<String>(extraBufferCapacity = 50)
        val executionLogs: SharedFlow<String> = _executionLogs.asSharedFlow()

        fun log(message: String) {
            Log.d(TAG, message)
            _executionLogs.tryEmit(message)
        }
    }

    private var gazeCursor: GazeCursor? = null
    private var lastX = 0.5f
    private var lastY = 0.5f

    override fun onServiceConnected() {
        super.onServiceConnected()
        instance = this
        gazeCursor = GazeCursor(this)
        gazeCursor?.show()
        log("Bound to com.neuroassist.AccessibilityService")
        log("Gaze cursor initialized")
    }

    /**
     * Updates the cursor position from the tracking engine.
     */
    fun updateCursorPosition(x: Float, y: Float) {
        lastX = x
        lastY = y
        gazeCursor?.updatePosition(x, y)
    }

    /**
     * Performs a click at the current cursor position.
     */
    fun performClickAtCursor() {
        gazeCursor?.triggerClickAnimation()
        
        val displayMetrics = resources.displayMetrics
        val screenX = lastX * displayMetrics.widthPixels
        val screenY = lastY * displayMetrics.heightPixels

        val path = Path().apply {
            moveTo(screenX, screenY)
        }
        
        val gestureBuilder = GestureDescription.Builder()
        gestureBuilder.addStroke(GestureDescription.StrokeDescription(path, 0, 100))
        
        dispatchGesture(gestureBuilder.build(), object : GestureResultCallback() {
            override fun onCompleted(gestureDescription: GestureDescription?) {
                log("Dispatched click at ($lastX, $lastY)")
            }
        }, null)
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        // We can monitor window/node changes if needed for gaze cursor context.
    }

    override fun onInterrupt() {
        log("Service Interrupted")
    }

    override fun onDestroy() {
        gazeCursor?.hide()
        gazeCursor = null
        super.onDestroy()
        instance = null
        log("Service Destroyed")
    }

    /**
     * Executes a parsed VoiceCommand/Gesture on the active window.
     */
    fun executeCommand(command: VoiceCommand) {
        log("Executing command: ${command.action}")
        when (command.action) {
            "BACK" -> {
                performGlobalAction(GLOBAL_ACTION_BACK)
                log("Dispatched GLOBAL_ACTION_BACK")
            }
            "HOME" -> {
                performGlobalAction(GLOBAL_ACTION_HOME)
                log("Dispatched GLOBAL_ACTION_HOME")
            }
            "NOTIFICATIONS" -> {
                performGlobalAction(GLOBAL_ACTION_NOTIFICATIONS)
                log("Dispatched GLOBAL_ACTION_NOTIFICATIONS")
            }
            "LOCK" -> {
                performGlobalAction(GLOBAL_ACTION_LOCK_SCREEN)
                log("Dispatched GLOBAL_ACTION_LOCK_SCREEN")
            }
            "SCREENSHOT" -> {
                performGlobalAction(GLOBAL_ACTION_TAKE_SCREENSHOT)
                log("Dispatched GLOBAL_ACTION_TAKE_SCREENSHOT")
            }
            "SCROLL_DOWN" -> {
                scrollActiveWindow(forward = true)
            }
            "SCROLL_UP" -> {
                scrollActiveWindow(forward = false)
            }
            "SWIPE_LEFT" -> {
                swipe(fromRightToLeft = true)
            }
            "SWIPE_RIGHT" -> {
                swipe(fromRightToLeft = false)
            }
            "OPEN_APP" -> {
                command.target?.let { launchAppByName(it) }
            }
            "CLICK" -> {
                command.number?.let { clickNodeByIndex(it) }
            }
            "CLICK_ELEMENT" -> {
                command.text?.let { clickNodeByText(it) }
            }
            "TYPE" -> {
                command.text?.let { typeTextIntoFocusedNode(it) }
            }
            "READ_SCREEN" -> {
                readActiveWindowContent()
            }
            else -> {
                log("Unhandled action: ${command.action}")
            }
        }
    }

    /**
     * Finds the first scrollable container and scrolls it.
     */
    private fun scrollActiveWindow(forward: Boolean) {
        val root = rootInActiveWindow ?: return
        val scrollableNode = findScrollableNode(root)
        if (scrollableNode != null) {
            val action = if (forward) {
                AccessibilityNodeInfo.ACTION_SCROLL_FORWARD
            } else {
                AccessibilityNodeInfo.ACTION_SCROLL_BACKWARD
            }
            val success = scrollableNode.performAction(action)
            log("Scroll ${if (forward) "forward" else "backward"} success: $success")
            scrollableNode.recycle()
        } else {
            log("No scrollable node found in active window")
        }
        root.recycle()
    }

    private fun findScrollableNode(node: AccessibilityNodeInfo): AccessibilityNodeInfo? {
        if (node.isScrollable) {
            return AccessibilityNodeInfo.obtain(node)
        }
        for (i in 0 until node.childCount) {
            val child = node.getChild(i) ?: continue
            val found = findScrollableNode(child)
            child.recycle()
            if (found != null) {
                return found
            }
        }
        return null
    }

    /**
     * Performs a programmatic swipe gesture.
     */
    private fun swipe(fromRightToLeft: Boolean) {
        val displayMetrics = resources.displayMetrics
        val width = displayMetrics.widthPixels
        val height = displayMetrics.heightPixels

        val startX = if (fromRightToLeft) width * 0.85f else width * 0.15f
        val endX = if (fromRightToLeft) width * 0.15f else width * 0.85f
        val y = height * 0.5f

        val path = Path().apply {
            moveTo(startX, y)
            lineTo(endX, y)
        }

        val gestureBuilder = GestureDescription.Builder()
        gestureBuilder.addStroke(GestureDescription.StrokeDescription(path, 0, 500))

        dispatchGesture(gestureBuilder.build(), object : GestureResultCallback() {
            override fun onCompleted(gestureDescription: GestureDescription?) {
                super.onCompleted(gestureDescription)
                log("Swipe gesture completed")
            }
            override fun onCancelled(gestureDescription: GestureDescription?) {
                super.onCancelled(gestureDescription)
                log("Swipe gesture cancelled")
            }
        }, null)
    }

    /**
     * Launches an app using package name matching.
     */
    private fun launchAppByName(appName: String) {
        log("Resolving package for app: $appName")
        val pm = packageManager
        val mainIntent = Intent(Intent.ACTION_MAIN, null).apply {
            addCategory(Intent.CATEGORY_LAUNCHER)
        }
        val resolveInfos = pm.queryIntentActivities(mainIntent, 0)
        var packageToLaunch: String? = null

        val cleanAppName = appName.lowercase()
        for (info in resolveInfos) {
            val label = info.loadLabel(pm).toString().lowercase()
            if (label.contains(cleanAppName) || cleanAppName.contains(label)) {
                packageToLaunch = info.activityInfo.packageName
                break
            }
        }

        if (packageToLaunch != null) {
            val intent = pm.getLaunchIntentForPackage(packageToLaunch)
            if (intent != null) {
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                startActivity(intent)
                log("Launching package: $packageToLaunch via Intent")
            } else {
                log("Launch intent not found for package: $packageToLaunch")
            }
        } else {
            log("No installed package found matching app name: $appName")
        }
    }

    /**
     * Traverses the node tree and clicks the node at the specified index of visible interactive items.
     */
    private fun clickNodeByIndex(index: Int) {
        val root = rootInActiveWindow ?: return
        val clickableList = mutableListOf<AccessibilityNodeInfo>()
        findClickableNodes(root, clickableList)
        log("Visible clickable items: ${clickableList.size}")

        if (index in 1..clickableList.size) {
            val target = clickableList[index - 1]
            val success = target.performAction(AccessibilityNodeInfo.ACTION_CLICK)
            log("Click item #$index success: $success")
        } else {
            log("Index #$index out of bounds (1..${clickableList.size})")
        }

        // Clean up list nodes
        clickableList.forEach { it.recycle() }
        root.recycle()
    }

    private fun findClickableNodes(node: AccessibilityNodeInfo, list: MutableList<AccessibilityNodeInfo>) {
        val bounds = Rect()
        node.getBoundsInScreen(bounds)
        // Ensure the node is visible on screen
        val isVisible = bounds.width() > 0 && bounds.height() > 0

        if (isVisible && (node.isClickable || node.isFocusable)) {
            list.add(AccessibilityNodeInfo.obtain(node))
        }

        for (i in 0 until node.childCount) {
            val child = node.getChild(i) ?: continue
            findClickableNodes(child, list)
            child.recycle()
        }
    }

    /**
     * Find a node with matching text or description and click it.
     */
    private fun clickNodeByText(text: String) {
        val root = rootInActiveWindow ?: return
        val nodes = root.findAccessibilityNodeInfosByText(text)
        if (!nodes.isNullOrEmpty()) {
            val target = nodes[0]
            val success = target.performAction(AccessibilityNodeInfo.ACTION_CLICK)
            log("Click node with text \"$text\" success: $success")
            target.recycle()
        } else {
            log("Node with text \"$text\" not found")
        }
        root.recycle()
    }

    /**
     * Type text into the currently focused edit text.
     */
    private fun typeTextIntoFocusedNode(text: String) {
        val root = rootInActiveWindow ?: return
        val focusedNode = root.findFocus(AccessibilityNodeInfo.FOCUS_INPUT)
        if (focusedNode != null) {
            val arguments = Bundle().apply {
                putCharSequence(AccessibilityNodeInfo.ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE, text)
            }
            val success = focusedNode.performAction(AccessibilityNodeInfo.ACTION_SET_TEXT, arguments)
            log("Type \"$text\" into focused input success: $success")
            focusedNode.recycle()
        } else {
            log("No focused input node found")
        }
        root.recycle()
    }

    /**
     * Reads screen elements and broadcasts text context to be spoken.
     */
    private fun readActiveWindowContent() {
        val root = rootInActiveWindow ?: return
        val sb = StringBuilder()
        extractAllText(root, sb)
        val screenContent = sb.toString().trim()
        if (screenContent.isNotEmpty()) {
            log("Screen read text extracted: \"$screenContent\"")
            // Normally triggers TTS from MainActivity, or local TTS engine
        } else {
            log("No readable text found on active window")
        }
        root.recycle()
    }

    private fun extractAllText(node: AccessibilityNodeInfo, sb: StringBuilder) {
        val text = node.text
        val contentDesc = node.contentDescription

        if (!text.isNullOrEmpty()) {
            sb.append(text).append(" ")
        } else if (!contentDesc.isNullOrEmpty()) {
            sb.append(contentDesc).append(" ")
        }

        for (i in 0 until node.childCount) {
            val child = node.getChild(i) ?: continue
            extractAllText(child, sb)
            child.recycle()
        }
    }
}
