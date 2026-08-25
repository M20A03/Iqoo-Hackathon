package com.neuroassist.edge.input

import java.util.Locale
import java.util.regex.Pattern

/**
 * VoiceCommandEngine — Ported from commands.ts.
 *
 * Implements offline regex NLP parsing of voice transcripts into structured commands.
 * Identifies 12 action categories and extracts targets, names, phone numbers, and dictation text.
 */
class VoiceCommandEngine {

    data class VoiceCommand(
        val action: String,
        val target: String? = null,
        val text: String? = null,
        val contact: String? = null,
        val number: Int? = null,
        val confidence: Float = 0.0f
    )

    companion object {
        // App names for matching
        private val KNOWN_APPS = listOf(
            "whatsapp", "instagram", "youtube", "maps", "google maps",
            "chrome", "settings", "camera", "phone", "messages", "sms",
            "telegram", "signal", "spotify", "music", "calendar",
            "gmail", "email", "contacts", "clock", "alarm", "calculator",
            "notes", "files", "gallery", "photos", "twitter", "x",
            "facebook", "snapchat", "discord", "slack", "zoom",
            "uber", "swiggy", "zomato", "paytm", "gpay", "phonepe"
        )
    }

    /**
     * Parses a voice transcript into a structured VoiceCommand.
     */
    fun parseCommand(transcript: String): VoiceCommand {
        val lower = transcript.lowercase(Locale.getDefault()).trim()

        // ── 1. Navigation ──
        if (lower.contains(Regex("\\b(go\\s*back|back)\\b"))) {
            return VoiceCommand("BACK", confidence = 0.95f)
        }
        if (lower.contains(Regex("\\b(go\\s*home|home\\s*screen)\\b"))) {
            return VoiceCommand("HOME", confidence = 0.95f)
        }
        if (lower.contains(Regex("\\bscroll\\s*down\\b"))) {
            return VoiceCommand("SCROLL_DOWN", confidence = 0.95f)
        }
        if (lower.contains(Regex("\\bscroll\\s*up\\b"))) {
            return VoiceCommand("SCROLL_UP", confidence = 0.95f)
        }
        if (lower.contains(Regex("\\bswipe\\s*(left)\\b"))) {
            return VoiceCommand("SWIPE_LEFT", confidence = 0.90f)
        }
        if (lower.contains(Regex("\\bswipe\\s*(right)\\b"))) {
            return VoiceCommand("SWIPE_RIGHT", confidence = 0.90f)
        }

        // ── 2. Complex: "Open X and send Y to Z" ──
        val openSendPattern = Pattern.compile("open\\s+(.+?)\\s+and\\s+(?:send|tell|message|write)\\s+['\"\"']?(.+?)['\"\"']?\\s+to\\s+(.+)")
        val openSendMatcher = openSendPattern.matcher(lower)
        if (openSendMatcher.find()) {
            val app = matchApp(openSendMatcher.group(1))
            val text = openSendMatcher.group(2).trim()
            val contact = capitalizeWords(openSendMatcher.group(3).trim())
            return VoiceCommand("OPEN_AND_SEND", target = app, text = text, contact = contact, confidence = 0.90f)
        }

        // ── 3. Complex: "Send Y to Z on X" ──
        val sendToOnPattern = Pattern.compile("(?:send|tell|message)\\s+['\"\"']?(.+?)['\"\"']?\\s+to\\s+(.+?)\\s+on\\s+(.+)")
        val sendToOnMatcher = sendToOnPattern.matcher(lower)
        if (sendToOnMatcher.find()) {
            val text = sendToOnMatcher.group(1).trim()
            val contact = capitalizeWords(sendToOnMatcher.group(2).trim())
            val app = matchApp(sendToOnMatcher.group(3))
            return VoiceCommand("OPEN_AND_SEND", target = app, text = text, contact = contact, confidence = 0.85f)
        }

        // ── 4. Complex: "Call X" / "Call X on WhatsApp" ──
        val callPattern = Pattern.compile("call\\s+(.+?)(?:\\s+on\\s+(.+))?$")
        val callMatcher = callPattern.matcher(lower)
        if (callMatcher.find()) {
            val contact = capitalizeWords(callMatcher.group(1).trim())
            val app = callMatcher.group(2)?.let { matchApp(it) } ?: "Phone"
            return VoiceCommand("CALL", target = app, contact = contact, confidence = 0.90f)
        }

        // ── 5. Open App (simple) ──
        val openPattern = Pattern.compile("(?:open|launch|start|go\\s+to)\\s+(.+)")
        val openMatcher = openPattern.matcher(lower)
        if (openMatcher.find() && !lower.contains("open mouth")) {
            val rawApp = openMatcher.group(1).replace(Regex("\\s+and\\s+.*$"), "").trim()
            val appName = matchApp(rawApp)

            // Check if there's "and do something" after
            val andPartPattern = Pattern.compile("(?:open|launch)\\s+.+?\\s+and\\s+(.+)")
            val andPartMatcher = andPartPattern.matcher(lower)
            if (andPartMatcher.find()) {
                val subAction = andPartMatcher.group(1).trim()
                // "open chrome and search for cats"
                val searchPartPattern = Pattern.compile("(?:search|look|find)\\s+(?:for\\s+)?(.+)")
                val searchPartMatcher = searchPartPattern.matcher(subAction)
                if (searchPartMatcher.find()) {
                    return VoiceCommand("OPEN_AND_SEARCH", target = appName, text = searchPartMatcher.group(1).trim(), confidence = 0.85f)
                }
                // Generic: "open X and Y"
                return VoiceCommand("OPEN_AND_DO", target = appName, text = subAction, confidence = 0.75f)
            }

            return VoiceCommand("OPEN_APP", target = appName, confidence = 0.90f)
        }

        // ── 6. Search ──
        val searchPattern = Pattern.compile("(?:search|look\\s+up|find|google)\\s+(?:for\\s+)?(.+)")
        val searchMatcher = searchPattern.matcher(lower)
        if (searchMatcher.find()) {
            return VoiceCommand("SEARCH", text = searchMatcher.group(1).trim(), confidence = 0.85f)
        }

        // ── 7. Type / Dictate ──
        val typePattern = Pattern.compile("(?:type|write|enter|input|dictate)\\s+(.+)")
        val typeMatcher = typePattern.matcher(lower)
        if (typeMatcher.find()) {
            return VoiceCommand("TYPE", text = typeMatcher.group(1).trim(), confidence = 0.90f)
        }

        // ── 8. Click / Tap ──
        if (lower.contains(Regex("\\b(click|tap|press|select|hit)\\b"))) {
            val numPattern = Pattern.compile("(?:click|tap|press|select|hit)\\s+(?:item\\s+|number\\s+|#)?(\\d+)")
            val numMatcher = numPattern.matcher(lower)
            if (numMatcher.find()) {
                return VoiceCommand("CLICK", number = numMatcher.group(1).toInt(), confidence = 0.90f)
            }

            val elemPattern = Pattern.compile("(?:click|tap|press|select|hit)\\s+(?:on\\s+|the\\s+)?(.+?)(?:\\s+button)?$")
            val elemMatcher = elemPattern.matcher(lower)
            if (elemMatcher.find()) {
                return VoiceCommand("CLICK_ELEMENT", text = elemMatcher.group(1).trim(), confidence = 0.80f)
            }
        }

        // ── 9. Media ──
        if (lower.contains(Regex("\\b(play|resume)\\b"))) return VoiceCommand("PLAY", confidence = 0.90f)
        if (lower.contains(Regex("\\b(pause|stop)\\b"))) return VoiceCommand("PAUSE", confidence = 0.90f)
        if (lower.contains(Regex("\\b(skip|next\\s*(track|song)?)\\b"))) return VoiceCommand("SKIP", confidence = 0.90f)
        if (lower.contains(Regex("\\bprevious\\b"))) return VoiceCommand("PREVIOUS", confidence = 0.90f)
        if (lower.contains(Regex("\\bvolume\\s*up\\b"))) return VoiceCommand("VOLUME_UP", confidence = 0.90f)
        if (lower.contains(Regex("\\bvolume\\s*down\\b"))) return VoiceCommand("VOLUME_DOWN", confidence = 0.90f)
        if (lower.contains(Regex("\\bmute\\b"))) return VoiceCommand("MUTE", confidence = 0.90f)

        // ── 10. System / Accessibility ──
        if (lower.contains(Regex("\\bread\\s*(screen|this|aloud|everything)\\b"))) {
            return VoiceCommand("READ_SCREEN", confidence = 0.95f)
        }
        if (lower.contains(Regex("\\b(magnify|zoom\\s*in)\\b"))) return VoiceCommand("MAGNIFY", confidence = 0.90f)
        if (lower.contains(Regex("\\b(zoom\\s*out)\\b"))) return VoiceCommand("ZOOM_OUT", confidence = 0.90f)
        if (lower.contains(Regex("\\btake\\s*(a\\s*)?screenshot\\b"))) return VoiceCommand("SCREENSHOT", confidence = 0.90f)
        if (lower.contains(Regex("\\b(brightness\\s*up|brighter)\\b"))) return VoiceCommand("BRIGHTNESS_UP", confidence = 0.85f)
        if (lower.contains(Regex("\\b(brightness\\s*down|dimmer)\\b"))) return VoiceCommand("BRIGHTNESS_DOWN", confidence = 0.85f)
        if (lower.contains(Regex("\\b(lock\\s*screen|lock\\s*phone)\\b"))) return VoiceCommand("LOCK", confidence = 0.90f)
        if (lower.contains(Regex("\\b(show\\s*notifications?|notification\\s*panel)\\b"))) {
            return VoiceCommand("NOTIFICATIONS", confidence = 0.90f)
        }

        // ── 11. Emergency ──
        if (lower.contains(Regex("\\b(emergency|help\\s*me|sos)\\b")) || lower == "help") {
            return VoiceCommand("EMERGENCY", confidence = 0.95f)
        }

        return VoiceCommand("UNKNOWN", text = transcript, confidence = 0.0f)
    }

    private fun matchApp(raw: String): String {
        val cleaned = raw.trim().lowercase(Locale.getDefault()).replace(Regex("['\"]"), "")
        val exactMatch = KNOWN_APPS.find { cleaned == it }
        if (exactMatch != null) return capitalizeWords(exactMatch)

        val partialMatch = KNOWN_APPS.find { cleaned.contains(it) || it.contains(cleaned) }
        if (partialMatch != null) return capitalizeWords(partialMatch)

        return capitalizeWords(cleaned)
    }

    private fun capitalizeWords(str: String): String {
        return str.split(" ").joinToString(" ") { word ->
            word.replaceFirstChar { if (it.isLowerCase()) it.titlecase(Locale.getDefault()) else it.toString() }
        }
    }
}
