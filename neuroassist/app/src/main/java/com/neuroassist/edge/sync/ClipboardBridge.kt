package com.neuroassist.edge.sync

import android.content.ClipboardManager
import android.content.Context
import android.util.Log
import com.neuroassist.edge.data.AppDatabase
import com.neuroassist.edge.data.MedicationLog
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.json.JSONObject

/**
 * ClipboardBridge — OriginOS Office Kit Bidirectional Sync.
 *
 * Listens to the system clipboard for prescription updates copied
 * on a connected desktop/laptop using Office Kit shared clipboard.
 * Auto-injects them into the local drug schedule database.
 */
class ClipboardBridge(
    private val context: Context,
    private val db: AppDatabase,
    private val onSyncComplete: (String) -> Unit
) : ClipboardManager.OnPrimaryClipChangedListener {

    companion object {
        private const val TAG = "ClipboardBridge"
        private const val CLIP_PREFIX = "prescription:"
    }

    private val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
    private val scope = CoroutineScope(Dispatchers.IO)

    fun start() {
        clipboard.addPrimaryClipChangedListener(this)
        Log.i(TAG, "Shared clipboard sync active")
    }

    fun stop() {
        clipboard.removePrimaryClipChangedListener(this)
        Log.i(TAG, "Shared clipboard sync stopped")
    }

    override fun onPrimaryClipChanged() {
        val clip = clipboard.primaryClip ?: return
        if (clip.itemCount == 0) return

        val text = clip.getItemAt(0).text?.toString() ?: return
        Log.d(TAG, "Clipboard update detected: $text")

        // Parse custom payload format from Caregiver Clipboard Sync
        // Format: prescription:{"name": "Aspirin", "category": "Blood Thinner", "warning": "Take daily after lunch"}
        if (text.startsWith(CLIP_PREFIX)) {
            val jsonStr = text.substring(CLIP_PREFIX.length).trim()
            try {
                val json = JSONObject(jsonStr)
                val name = json.getString("name")
                val category = json.getString("category")
                val warning = json.optString("warning", "No specific warnings")

                scope.launch {
                    // Inject into SQLite
                    db.medicationLogDao().insert(
                        MedicationLog(
                            name = name,
                            category = category,
                            timestamp = System.currentTimeMillis(),
                            isSafe = true,
                            warning = "Prescription synced: $warning"
                        )
                    )
                    
                    Log.i(TAG, "Successfully synced prescription from clipboard: $name")
                    onSyncComplete("Prescription synchronized: $name, $warning")
                }
            } catch (e: Exception) {
                Log.e(TAG, "Failed to parse synced clipboard payload", e)
            }
        }
    }
}
