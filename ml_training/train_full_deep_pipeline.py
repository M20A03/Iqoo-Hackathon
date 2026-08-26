#!/usr/bin/env python3
"""
PulseEdge-OS (Sahayak) — Master Deep Training & Evaluation Pipeline
Runs all 4 deep multi-stage training pipelines + exports INT8 Snapdragon NPU models + generates evaluation benchmarks.
"""

import sys
import time
from train_acoustic_stethoscope_advanced import train_stethoscope_kfold
from train_optical_sclera_anemia_advanced import train_sclera_multistage
from train_rppg_vitals_advanced import train_rppg_advanced
from train_tremor_and_gaze_advanced import train_tremor_and_gaze
from evaluate_models_benchmarks import evaluate_all_models
from export_tflite_npu import export_quantized_tflite_spec

if __name__ == "__main__":
    start_time = time.time()
    print("\n🚀 LAUNCHING FULL MULTI-STAGE EDGE-AI TRAINING SUITE")
    print("=" * 80)
    
    # 1. Acoustic Stethoscope 5-Fold QAT
    train_stethoscope_kfold(k_folds=5, epochs_per_fold=10)
    
    # 2. Sclera & Conjunctiva Multi-Stage
    train_sclera_multistage(epochs=30)
    
    # 3. Contactless Camera PPG
    train_rppg_advanced(epochs=30)
    
    # 4. Motor Tremor & Gaze
    train_tremor_and_gaze(epochs=25)
    
    # 5. Export INT8 TFLite Specs
    export_quantized_tflite_spec()
    
    # 6. Comprehensive Benchmarks
    evaluate_all_models()
    
    elapsed = time.time() - start_time
    print(f"\n🎉 FULL MULTI-STAGE DEEP TRAINING SUITE COMPLETED IN {elapsed:.2f}s!")
    print("=" * 80)
