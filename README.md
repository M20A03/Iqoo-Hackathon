# PulseEdge-OS (Sahayak) — Air-Gapped Medical Diagnostics & Zero-Touch Neuro-Accessibility

[![iQOO Hackathon 2026](https://img.shields.io/badge/iQOO_Hackathon-HealthTech_Track-0ea5e9.svg)](https://pulse1edge.vercel.app/)
[![Snapdragon NPU](https://img.shields.io/badge/Snapdragon_NPU-100%25_Offline_Edge_AI-10b981.svg)](https://qualcomm.com)
[![OriginOS Office Kit](https://img.shields.io/badge/OriginOS-Office_Kit_Multi--Window-6366f1.svg)](https://vivo.com)

**PulseEdge-OS (Sahayak)** is a multimodal, medical-grade diagnostic operating layer and hands-free neuro-accessibility assistant built for the **iQOO Hackathon 2026 (HealthTech & AI Accessibility Track)**.

---

## 🌟 Architecture & 3 Master Pillars

```
                  ┌────────────────────────────────────────────────────────┐
                  │             iQOO Flagship (Snapdragon NPU)             │
                  │               100% Offline Edge Runtime                │
                  └──────────────────────────┬─────────────────────────────┘
                                             │
     ┌───────────────────────────────────────┼───────────────────────────────────────┐
     ▼                                       ▼                                       ▼
┌───────────────────────────────┐       ┌───────────────────────────────┐       ┌───────────────────────────────┐
│     BIOPHYSICAL DIAGNOSTICS   │       │     NEURO-ACCESSIBILITY       │       │    PHARMA & TELEMETRY         │
├───────────────────────────────┤       ├───────────────────────────────┤       ├───────────────────────────────┤
│ • Acoustic Stethoscope (FFT)  │       │ • 60 FPS Head/Gaze Tracking   │       │ • Jan Aushadhi Generic Match  │
│ • Sclera/Conjunctiva Scanner  │       │ • Blink / Smile Micro-Clicks  │       │ • CDSCO Conflict Checker      │
│ • Camera PPG (Pulse & SpO2)   │       │ • Breath / Sub-Vocal Triggers │       │ • Office Kit Doctor HUD       │
│ • Kinetic Tremor Suppression  │       │ • Multilingual Voice TTS      │       │ • Super Clipboard Sync        │
└───────────────────────────────┘       └───────────────────────────────┘       └───────────────────────────────┘
```

---

## 🚀 Key Feature Breakdown

### 1. Biophysical Diagnostics
- **Acoustic Stethoscope (Audio FFT 200 Hz–1000 Hz)**: 16-bit PCM 44.1 kHz on-device Fast Fourier Transform distinguishing high-pitch continuous wheezes (Asthma/COPD, 450–550 Hz) from discontinuous dry crackles (Pneumonia, 200–350 Hz).
- **Optical Sclera & Inner-Eyelid Scanner**: Calibrated camera LED flash optics analyzing palpebral conjunctiva color density (R/G ratio) for acute Anemia screening and scleral yellow-shift (&Delta;b*) for Jaundice & Hepatitis detection.
- **Contactless Camera PPG (Heart Rate & SpO2)**: Micro-vascular capillary hemoglobin fluctuation analysis extracting resting BPM and peripheral oxygen saturation (SpO2) completely offline.
- **Parkinson’s Motor Tremor Filter**: Software low-pass velocity kernel smoothing erratic 4–8Hz hand tremors into clean single taps.

### 2. Zero-Touch Neuro-Accessibility
- **60 FPS Head & Iris Gaze Tracking**: MediaPipe Face Mesh running 468 landmarks on the Snapdragon NPU with 360-degree radial dwell timer.
- **Micro-Gestures & Sub-Vocal Selection**: Smile listeners (primary click), mouth-aspect-ratio expansion (downward scroll), intentional blinks (speed-dials), and high-energy acoustic breath/puff clicks for vocal/motor paralysis.
- **Universal Accessibility Dispatcher**: System-level event injection into third-party apps (WhatsApp, Spotify, YouTube, Maps) with zero code modifications needed.
- **Multilingual Indic Audio**: Offline spoken feedback in English, Hindi, and Kannada.

### 3. Rural Pharma & Doctor Telemetry
- **Pradhan Mantri Jan Aushadhi Generic Matcher**: Scans branded medicine blister packs (e.g. Augmentin 625, Lipitor) via offline OCR, maps chemical salts, and displays government Jan Aushadhi generic equivalents with up to 85% cost savings.
- **Offline CDSCO Contraindication Shield**: Cross-checks patient history against local Room SQLite DB to flag lethal double-dosing and drug-drug interactions (e.g. Aspirin + Warfarin).
- **OriginOS Office Kit Doctor Station**: Multi-Window screen mirroring to desktop telemetry monitors, with bidirectional prescription injection via OriginOS Super Clipboard.

---

## 📁 Repository Structure

```
├── website/              # Frosted Light Clinical Theme React Website + 5D Simulator
│   ├── src/              # Components, Clinical Illustrations & 5D Sensory CSS
│   ├── public/           # Downloadable PulseEdge-OS.apk (119.8MB)
│   └── package.json
├── caregiver-hud/        # OriginOS Office Kit Telemetry HUD & Doctor Station
├── neuroassist/          # Native Android Kotlin NPU background service & MediaPipe
├── sahayak/              # Mobile Client Application (Capacitor / React / Room SQLite)
├── sahayak-physical/     # Physical diagnostics prototype module
└── stich/                # UI/UX design specifications
```

---

## 💻 Quick Start & Running the Website

```bash
cd website
npm install
npm run dev
```

Visit `http://localhost:5173` to experience the **Frosted Light Clinical Theme with 5D Sensory Dynamics & Live Playground**, or access the live deployment at [pulse1edge.vercel.app](https://pulse1edge.vercel.app/).