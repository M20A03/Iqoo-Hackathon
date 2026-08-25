package com.neuroassist.edge.data

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * MedicationLog — Room Database Entity.
 * Stores records of scanned medications and safety compliance checks.
 */
@Entity(tableName = "medication_logs")
data class MedicationLog(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val name: String,
    val category: String,
    val timestamp: Long,
    val isSafe: Boolean,
    val warning: String? = null
)
