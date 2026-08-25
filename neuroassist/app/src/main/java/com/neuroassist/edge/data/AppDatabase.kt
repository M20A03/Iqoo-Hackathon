package com.neuroassist.edge.data

import android.content.Context
import androidx.room.*

@Dao
interface MedicationLogDao {
    @Query("SELECT * FROM medication_logs ORDER BY timestamp DESC")
    suspend fun getAll(): List<MedicationLog>

    @Query("SELECT * FROM medication_logs WHERE timestamp > :sinceTime ORDER BY timestamp DESC")
    suspend fun getRecent(sinceTime: Long): List<MedicationLog>

    @Insert
    suspend fun insert(log: MedicationLog)

    @Query("DELETE FROM medication_logs")
    suspend fun deleteAll()
}

@Dao
interface VitalsLogDao {
    @Query("SELECT * FROM vitals_logs ORDER BY timestamp DESC")
    suspend fun getAll(): List<VitalsLog>

    @Insert
    suspend fun insert(log: VitalsLog)

    @Query("DELETE FROM vitals_logs")
    suspend fun deleteAll()
}

/**
 * Room database definition for NeuroAssist-Edge.
 * Manages tables for medication logs and vital measurements offline.
 */
@Database(entities = [MedicationLog::class, VitalsLog::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun medicationLogDao(): MedicationLogDao
    abstract fun vitalsLogDao(): VitalsLogDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "neuroassist_db"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
