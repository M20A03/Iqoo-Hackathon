package com.neuroassist.edge.data

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * VitalsLog — Room Database Entity.
 * Stores heart rate and SpO2 measurements recorded locally via Camera PPG.
 */
@Entity(tableName = "vitals_logs")
data class VitalsLog(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val heartRate: Int,
    val spo2: Int,
    val timestamp: Long
)
