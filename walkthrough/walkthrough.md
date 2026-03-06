# Portfolio Update — Walkthrough

## Overview

Updated the portfolio website with new projects, expanded skills, and a new certification.

## Changes Made

All changes in: `src/App.jsx`

### 1. Projects (4 → 10)

Added 6 new projects from GitHub, each with a custom animated visual:

| Project                            | Visual Animation                | GitHub Repo                            |
| ---------------------------------- | ------------------------------- | -------------------------------------- |
| RAG System — Full-Stack RAG        | DOC → VECTORS → ANSWER flow     | `rag-foundation-pgvector`              |
| Mini-CNN Framework                 | LeNet-5 layer architecture      | `Mini-CNN-Framework`                   |
| YOLO Bat Swing Analysis            | Animated bat swing arc          | `Yolo-Bat-swing-analysis-`             |
| Radar-AI: Object Detection         | Radar sweep + classified labels | `Radar-AI-...`                         |
| Face Detection & 3D Reconstruction | Rotating 3D wireframe mesh      | `Face-Detection-and-3D-Reconstruction` |
| N8N Webhook Forwarder              | TRIGGER → N8N → ACTION flow     | `N8N`                                  |

### 2. Skills (4 → 5 categories)

- **Programming & Tools**: Added `C/C++`, `FastAPI`, `Docker`, `CMake`
- **AI/ML**: Added `YOLOv8`, `MediaPipe`, `GANs`, `LangChain`, `Gemini API`
- **Web & Backend** _(NEW)_: `React`, `PostgreSQL`, `pgvector`, `Streamlit`
- **Data Analysis & Visualization**: Unchanged
- **Collaboration**: Added `N8N`

14 new shield.io badge URLs added to `SkillBadge` component.

### 3. Certifications (5 → 6)

Added **"Claude Code in Action"** by **Anthropic** as the first certification card.

- Credential URL: http://verify.skilljar.com/c/633xi2hd6rm6

### 4. Visual Components

Created 6 new animated React components:

- `RAGSystemVisual` — Document → vector embedding → answer pipeline
- `MiniCNNVisual` — Stacked CNN layers with data flow animation
- `BatSwingVisual` — Bat swing arc with metric labels
- `FaceReconVisual` — Rotating 3D point cloud wireframe
- `RadarAIVisual` — Radar sweep with classified object blips
- `WebhookVisual` — Trigger → N8N → Action webhook flow

## Verification

- ✅ Page loads without errors
- ✅ 5 skill categories with all badges rendering
- ✅ 10 project cards with animated visuals
- ✅ 6 certification cards
- ✅ Responsive layout intact
