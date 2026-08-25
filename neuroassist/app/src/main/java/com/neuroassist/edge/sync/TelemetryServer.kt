package com.neuroassist.edge.sync

import android.util.Log
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.ktor.websocket.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.channels.ClosedSendChannelException
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.launch
import java.util.Collections
import java.util.concurrent.ConcurrentHashMap

/**
 * TelemetryServer — Lightweight embedded WebSocket server.
 *
 * Runs locally on the phone (Port 8080) to stream real-time gaze heatmaps,
 * vitals data, and speech command logs to the desktop Caregiver HUD.
 */
class TelemetryServer {

    companion object {
        private const val TAG = "TelemetryServer"
        private const val PORT = 8080
    }

    private var server: NettyApplicationEngine? = null
    private val activeSessions = Collections.newSetFromMap(ConcurrentHashMap<DefaultWebSocketSession, Boolean>())
    private val scope = CoroutineScope(Dispatchers.IO)

    /**
     * Start the server on Port 8080.
     */
    fun start() {
        if (server != null) return

        try {
            server = embeddedServer(Netty, port = PORT, configure = {
                // Connection idle timeout
                responseWriteTimeoutSeconds = 10
            }) {
                install(WebSockets)
                install(ContentNegotiation) {
                    json()
                }

                routing {
                    webSocket("/telemetry") {
                        Log.i(TAG, "New caregiver HUD client connected: $this")
                        activeSessions.add(this)
                        try {
                            send(Frame.Text("Connected to PulseEdge-OS Live Telemetry HUD"))
                            for (frame in incoming) {
                                // Keep connection open or process incoming caregiver requests
                                if (frame is Frame.Text) {
                                    Log.d(TAG, "Received message from caregiver: ${frame.readText()}")
                                }
                            }
                        } catch (e: Exception) {
                            Log.e(TAG, "Error in websocket session", e)
                        } finally {
                            activeSessions.remove(this)
                            Log.i(TAG, "Caregiver HUD client disconnected: $this")
                        }
                    }
                }
            }.apply {
                start(wait = false)
            }
            Log.i(TAG, "Local Telemetry server running on port $PORT")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to start Telemetry server. Port might be in use.", e)
        }
    }

    /**
     * Broadcast live telemetry data to all connected caregiver dashboard clients.
     * @param jsonPayload Preformatted JSON string containing telemetry updates.
     */
    fun broadcastTelemetry(jsonPayload: String) {
        scope.launch {
            val closedSessions = mutableListOf<DefaultWebSocketSession>()
            for (session in activeSessions) {
                try {
                    session.send(Frame.Text(jsonPayload))
                } catch (e: ClosedSendChannelException) {
                    closedSessions.add(session)
                } catch (e: Exception) {
                    Log.e(TAG, "Failed to send telemetry update", e)
                }
            }
            activeSessions.removeAll(closedSessions)
        }
    }

    /**
     * Stop the server and release port.
     */
    fun stop() {
        server?.stop(1000, 2000)
        server = null
        activeSessions.clear()
        Log.i(TAG, "Local Telemetry server stopped")
    }
}
