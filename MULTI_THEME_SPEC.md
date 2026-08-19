# MULTI-THEME SYSTEM SPECIFICATION & IMPLEMENTATION GUIDE

**Project:** Ashwin Vignesh M — Portfolio (`react-portfolio`)  
**Target:** Live Multi-Theme System & Palette Switcher with 5 Curated Engineering Presets  
**Status:** Ready for Implementation  

---

## 1. Executive Summary & Goals

This specification details the architecture and implementation for adding a **Live Multi-Theme Palette Switcher** to the portfolio. It allows visitors, recruiters, and the portfolio owner to switch in real-time between 5 high-contrast, engineering-focused themes with persistent storage and full Dark / Light mode compatibility.

### Key Goals:
1. **5 Curated Themes:**
   - 🌐 **Cyber-Optic Cyan** (`cyan` — Default): Autonomous Systems, LiDAR, Computer Vision
   - ⚡ **Signal Telemetry Amber** (`amber`): Precision Instrument, Aerospace Hardware
   - 🧠 **Neural Titanium Indigo** (`indigo`): Frontier AI, LLM Systems & RAG
   - 🟢 **CUDA Matrix Emerald** (`emerald`): High-Performance C++, GPU & Edge Compute
   - 🚀 **Aerospace HUD Crimson** (`crimson`): High-Octane Telemetry & Automotive
2. **Zero Breaking Changes:** Works completely within the existing CSS token architecture (`var(--bg)`, `var(--accent)`, `var(--rule)`, etc.).
3. **Seamless Dark & Light Modes:** Every palette has tuned, high-contrast values for both `:root` (dark) and `.theme-light`.
4. **Instant Persistence:** Stores preference in `localStorage.getItem('theme-palette')` and applies instantly without layout shift or flash of unstyled content.
5. **Interactive UI Selector:** Sleek, accessible popover button in the Header (desktop + mobile drawer) with live animated swatches.
6. **Dynamic Canvas Sync:** Dynamically binds canvas components (like `LidarSweep.jsx`) to the active accent color.

---

## 2. Design System Tokens & Color Matrices

### 2.1 Theme Definitions

```typescript
export interface ThemeOption {
  id: 'cyan' | 'amber' | 'indigo' | 'emerald' | 'crimson';
  name: string;
  subtitle: string;
  accentDark: string;
  accentLight: string;
  bgDark: string;
  bgLight: string;
}
```

### 2.2 Palette Specifications

#### Theme 1: `cyan` — Cyber-Optic (Default)
- **Dark Mode (`:root` / `.theme-dark.palette-cyan`):**
  - `--bg`: `#05080f`
  - `--surface-1`: `#0a101d`
  - `--surface-2`: `#0f182a`
  - `--surface-3`: `#152238`
  - `--rule`: `#1b293d`
  - `--rule-strong`: `#283b54`
  - `--text`: `#e6f1fc`
  - `--text-muted`: `#8da0b6`
  - `--text-dim`: `#596c82`
  - `--accent`: `#00f2fe`
  - `--on-accent`: `#05080f`
  - `--accent-strong`: `#38bdf8`
  - `--accent-dim`: `#0284c7`
  - `--accent-wash`: `rgba(0, 242, 254, 0.1)`
  - `--accent-line`: `rgba(0, 242, 254, 0.35)`
  - Heatmap:
    - `--heat-0`: `#0f182a`
    - `--heat-1`: `rgba(0, 242, 254, 0.22)`
    - `--heat-2`: `rgba(0, 242, 254, 0.45)`
    - `--heat-3`: `rgba(0, 242, 254, 0.7)`
    - `--heat-4`: `#00f2fe`
- **Light Mode (`.theme-light.palette-cyan`):**
  - `--bg`: `#f0f4f9`
  - `--surface-1`: `#ffffff`
  - `--surface-2`: `#e8eff6`
  - `--surface-3`: `#dbe5f0`
  - `--rule`: `#cbd8e6`
  - `--rule-strong`: `#a8bccf`
  - `--text`: `#0b131e`
  - `--text-muted`: `#48596c`
  - `--text-dim`: `#687a8f`
  - `--accent`: `#0284c7`
  - `--on-accent`: `#ffffff`
  - `--accent-strong`: `#0369a1`
  - `--accent-dim`: `#38bdf8`
  - `--accent-wash`: `rgba(2, 132, 199, 0.08)`
  - `--accent-line`: `rgba(2, 132, 199, 0.3)`
  - Heatmap:
    - `--heat-0`: `#dbe5f0`
    - `--heat-1`: `rgba(2, 132, 199, 0.22)`
    - `--heat-2`: `rgba(2, 132, 199, 0.45)`
    - `--heat-3`: `rgba(2, 132, 199, 0.7)`
    - `--heat-4`: `#0284c7`

---

#### Theme 2: `amber` — Signal Telemetry
- **Dark Mode (`:root` / `.theme-dark.palette-amber`):**
  - `--bg`: `#06080b`
  - `--surface-1`: `#0b0e13`
  - `--surface-2`: `#10151c`
  - `--surface-3`: `#161d26`
  - `--rule`: `#1c242e`
  - `--rule-strong`: `#2a3542`
  - `--text`: `#e7ecf3`
  - `--text-muted`: `#93a0b1`
  - `--text-dim`: `#5d6a7a`
  - `--accent`: `#ff9f1c`
  - `--on-accent`: `#0a0a0a`
  - `--accent-strong`: `#ffb54d`
  - `--accent-dim`: `#a86a10`
  - `--accent-wash`: `rgba(255, 159, 28, 0.1)`
  - `--accent-line`: `rgba(255, 159, 28, 0.35)`
  - Heatmap:
    - `--heat-0`: `#131a22`
    - `--heat-1`: `rgba(255, 159, 28, 0.22)`
    - `--heat-2`: `rgba(255, 159, 28, 0.45)`
    - `--heat-3`: `rgba(255, 159, 28, 0.7)`
    - `--heat-4`: `#ff9f1c`
- **Light Mode (`.theme-light.palette-amber`):**
  - `--bg`: `#f4f6f8`
  - `--surface-1`: `#ffffff`
  - `--surface-2`: `#eef1f5`
  - `--surface-3`: `#e4e9ef`
  - `--rule`: `#d8dee6`
  - `--rule-strong`: `#b6c0cc`
  - `--text`: `#10161d`
  - `--text-muted`: `#4d5a68`
  - `--text-dim`: `#667080`
  - `--accent`: `#b25e00`
  - `--on-accent`: `#ffffff`
  - `--accent-strong`: `#8f4b00`
  - `--accent-dim`: `#d9922f`
  - `--accent-wash`: `rgba(178, 94, 0, 0.08)`
  - `--accent-line`: `rgba(178, 94, 0, 0.3)`
  - Heatmap:
    - `--heat-0`: `#e4e9ef`
    - `--heat-1`: `rgba(178, 94, 0, 0.22)`
    - `--heat-2`: `rgba(178, 94, 0, 0.45)`
    - `--heat-3`: `rgba(178, 94, 0, 0.7)`
    - `--heat-4`: `#b25e00`

---

#### Theme 3: `indigo` — Neural Titanium
- **Dark Mode (`:root` / `.theme-dark.palette-indigo`):**
  - `--bg`: `#08090f`
  - `--surface-1`: `#0e101b`
  - `--surface-2`: `#141726`
  - `--surface-3`: `#1c2033`
  - `--rule`: `#22273e`
  - `--rule-strong`: `#333b5c`
  - `--text`: `#edf0fc`
  - `--text-muted`: `#969ec0`
  - `--text-dim`: `#606887`
  - `--accent`: `#6366f1`
  - `--on-accent`: `#ffffff`
  - `--accent-strong`: `#818cf8`
  - `--accent-dim`: `#4338ca`
  - `--accent-wash`: `rgba(99, 102, 241, 0.12)`
  - `--accent-line`: `rgba(99, 102, 241, 0.35)`
  - Heatmap:
    - `--heat-0`: `#141726`
    - `--heat-1`: `rgba(99, 102, 241, 0.22)`
    - `--heat-2`: `rgba(99, 102, 241, 0.45)`
    - `--heat-3`: `rgba(99, 102, 241, 0.7)`
    - `--heat-4`: `#6366f1`
- **Light Mode (`.theme-light.palette-indigo`):**
  - `--bg`: `#f4f6fc`
  - `--surface-1`: `#ffffff`
  - `--surface-2`: `#edf0f9`
  - `--surface-3`: `#dfe4f4`
  - `--rule`: `#cfd6eb`
  - `--rule-strong`: `#aab6d8`
  - `--text`: `#0e1222`
  - `--text-muted`: `#4a5372`
  - `--text-dim`: `#6d7696`
  - `--accent`: `#4338ca`
  - `--on-accent`: `#ffffff`
  - `--accent-strong`: `#3730a3`
  - `--accent-dim`: `#6366f1`
  - `--accent-wash`: `rgba(67, 56, 202, 0.08)`
  - `--accent-line`: `rgba(67, 56, 202, 0.3)`
  - Heatmap:
    - `--heat-0`: `#dfe4f4`
    - `--heat-1`: `rgba(67, 56, 202, 0.22)`
    - `--heat-2`: `rgba(67, 56, 202, 0.45)`
    - `--heat-3`: `rgba(67, 56, 202, 0.7)`
    - `--heat-4`: `#4338ca`

---

#### Theme 4: `emerald` — CUDA Matrix
- **Dark Mode (`:root` / `.theme-dark.palette-emerald`):**
  - `--bg`: `#040806`
  - `--surface-1`: `#08120c`
  - `--surface-2`: `#0e1c13`
  - `--surface-3`: `#14281b`
  - `--rule`: `#1b3524`
  - `--rule-strong`: `#274f36`
  - `--text`: `#e7f7ed`
  - `--text-muted`: `#8ebda0`
  - `--text-dim`: `#59856a`
  - `--accent`: `#00ff87`
  - `--on-accent`: `#040806`
  - `--accent-strong`: `#34d399`
  - `--accent-dim`: `#059669`
  - `--accent-wash`: `rgba(0, 255, 135, 0.1)`
  - `--accent-line`: `rgba(0, 255, 135, 0.35)`
  - Heatmap:
    - `--heat-0`: `#0e1c13`
    - `--heat-1`: `rgba(0, 255, 135, 0.22)`
    - `--heat-2`: `rgba(0, 255, 135, 0.45)`
    - `--heat-3`: `rgba(0, 255, 135, 0.7)`
    - `--heat-4`: `#00ff87`
- **Light Mode (`.theme-light.palette-emerald`):**
  - `--bg`: `#f0f8f4`
  - `--surface-1`: `#ffffff`
  - `--surface-2`: `#e6f3ec`
  - `--surface-3`: `#d5e9df`
  - `--rule`: `#c2dfcf`
  - `--rule-strong`: `#9dc6af`
  - `--text`: `#08180e`
  - `--text-muted`: `#43614e`
  - `--text-dim`: `#658371`
  - `--accent`: `#047857`
  - `--on-accent`: `#ffffff`
  - `--accent-strong`: `#065f46`
  - `--accent-dim`: `#10b981`
  - `--accent-wash`: `rgba(4, 120, 87, 0.08)`
  - `--accent-line`: `rgba(4, 120, 87, 0.3)`
  - Heatmap:
    - `--heat-0`: `#d5e9df`
    - `--heat-1`: `rgba(4, 120, 87, 0.22)`
    - `--heat-2`: `rgba(4, 120, 87, 0.45)`
    - `--heat-3`: `rgba(4, 120, 87, 0.7)`
    - `--heat-4`: `#047857`

---

#### Theme 5: `crimson` — Aerospace HUD
- **Dark Mode (`:root` / `.theme-dark.palette-crimson`):**
  - `--bg`: `#0b0708`
  - `--surface-1`: `#130c0e`
  - `--surface-2`: `#1d1215`
  - `--surface-3`: `#27181d`
  - `--rule`: `#362127`
  - `--rule-strong`: `#50303a`
  - `--text`: `#fce8eb`
  - `--text-muted`: `#c28f98`
  - `--text-dim`: `#875f66`
  - `--accent`: `#ff3366`
  - `--on-accent`: `#ffffff`
  - `--accent-strong`: `#fb7185`
  - `--accent-dim`: `#be123c`
  - `--accent-wash`: `rgba(255, 51, 102, 0.12)`
  - `--accent-line`: `rgba(255, 51, 102, 0.35)`
  - Heatmap:
    - `--heat-0`: `#1d1215`
    - `--heat-1`: `rgba(255, 51, 102, 0.22)`
    - `--heat-2`: `rgba(255, 51, 102, 0.45)`
    - `--heat-3`: `rgba(255, 51, 102, 0.7)`
    - `--heat-4`: `#ff3366`
- **Light Mode (`.theme-light.palette-crimson`):**
  - `--bg`: `#fcf2f4`
  - `--surface-1`: `#ffffff`
  - `--surface-2`: `#f7e6e9`
  - `--surface-3`: `#ebd5d9`
  - `--rule`: `#dfc0c6`
  - `--rule-strong`: `#c49ba4`
  - `--text`: `#1e0a0e`
  - `--text-muted`: `#6e444c`
  - `--text-dim`: `#8e636b`
  - `--accent`: `#be123c`
  - `--on-accent`: `#ffffff`
  - `--accent-strong`: `#9f1239`
  - `--accent-dim`: `#f43f5e`
  - `--accent-wash`: `rgba(190, 18, 60, 0.08)`
  - `--accent-line`: `rgba(190, 18, 60, 0.3)`
  - Heatmap:
    - `--heat-0`: `#ebd5d9`
    - `--heat-1`: `rgba(190, 18, 60, 0.22)`
    - `--heat-2`: `rgba(190, 18, 60, 0.45)`
    - `--heat-3`: `rgba(190, 18, 60, 0.7)`
    - `--heat-4`: `#be123c`

---

#### Theme 6: `ironman` — Stark Arc-Reactor (Marvel)
- **Dark Mode (`.palette-ironman`):**
  - `--bg`: `#080406` (Titanium Charcoal)
  - `--surface-1`: `#12090d`
  - `--surface-2`: `#1c0d13`
  - `--surface-3`: `#26121a`
  - `--rule`: `#3d1a24`
  - `--rule-strong`: `#592333`
  - `--text`: `#fef2f2`
  - `--text-muted`: `#e2a8a8`
  - `--text-dim`: `#995e68`
  - `--accent`: `#e63946` (Hot-Rod Crimson)
  - `--on-accent`: `#ffffff`
  - `--accent-strong`: `#ff5964`
  - `--accent-dim`: `#ba1826`
  - `--accent-wash`: `rgba(230, 57, 70, 0.12)`
  - `--accent-line`: `rgba(230, 57, 70, 0.4)`
  - `--ok`: `#ffb703` (Arc-Reactor Gold)
- **Light Mode (`.theme-light.palette-ironman`):**
  - `--bg`: `#faf5f5`
  - `--surface-1`: `#ffffff`
  - `--surface-2`: `#f5ebeb`
  - `--surface-3`: `#ebd5d5`
  - `--rule`: `#dec0c0`
  - `--rule-strong`: `#c99b9b`
  - `--text`: `#1a0507`
  - `--text-muted`: `#6e4347`
  - `--text-dim`: `#8c5d62`
  - `--accent`: `#b91c1c`
  - `--on-accent`: `#ffffff`

---

#### Theme 7: `vibranium` — Wakanda Royal Energy
- **Dark Mode (`.palette-vibranium`):**
  - `--bg`: `#06040a` (Obsidian Black)
  - `--surface-1`: `#0d0917`
  - `--surface-2`: `#140e24`
  - `--surface-3`: `#1e1536`
  - `--rule`: `#2c1e4f`
  - `--rule-strong`: `#422c75`
  - `--text`: `#f5f3ff`
  - `--text-muted`: `#b8a9db`
  - `--text-dim`: `#7c6a9e`
  - `--accent`: `#a855f7` (Kinetic Vibranium Purple)
  - `--on-accent`: `#ffffff`
  - `--accent-strong`: `#c084fc`
  - `--accent-dim`: `#7e22ce`
  - `--accent-wash`: `rgba(168, 85, 247, 0.12)`
  - `--accent-line`: `rgba(168, 85, 247, 0.4)`
- **Light Mode (`.theme-light.palette-vibranium`):**
  - `--bg`: `#f7f4fb`
  - `--surface-1`: `#ffffff`
  - `--surface-2`: `#eee8f6`
  - `--surface-3`: `#e1d6ee`
  - `--rule`: `#d0c0e3`
  - `--rule-strong`: `#b49ccf`
  - `--text`: `#11091d`
  - `--accent`: `#7e22ce`

---

#### Theme 8: `batman` — Gotham Tactical (WayneTech)
- **Dark Mode (`.palette-batman`):**
  - `--bg`: `#060708` (Carbon Stealth)
  - `--surface-1`: `#0c0d10`
  - `--surface-2`: `#121418`
  - `--surface-3`: `#191c22`
  - `--rule`: `#242830`
  - `--rule-strong`: `#363c48`
  - `--text`: `#f3f4f6`
  - `--text-muted`: `#9ca3af`
  - `--text-dim`: `#6b7280`
  - `--accent`: `#eab308` (Bat-Signal Tactical Gold)
  - `--on-accent`: `#060708`
  - `--accent-strong`: `#facc15`
  - `--accent-dim`: `#a16207`
  - `--accent-wash`: `rgba(234, 179, 8, 0.12)`
  - `--accent-line`: `rgba(234, 179, 8, 0.38)`
- **Light Mode (`.theme-light.palette-batman`):**
  - `--bg`: `#f3f4f6`
  - `--surface-1`: `#ffffff`
  - `--surface-2`: `#e5e7eb`
  - `--surface-3`: `#d1d5db`
  - `--rule`: `#9ca3af`
  - `--rule-strong`: `#6b7280`
  - `--text`: `#111827`
  - `--accent`: `#ca8a04`

---

#### Theme 9: `cyberpunk` — Neo Tokyo Synthwave
- **Dark Mode (`.palette-cyberpunk`):**
  - `--bg`: `#07030e` (Midnight Synthwave)
  - `--surface-1`: `#0f071e`
  - `--surface-2`: `#170b2e`
  - `--surface-3`: `#221042`
  - `--rule`: `#351863`
  - `--rule-strong`: `#512596`
  - `--text`: `#fdf4ff`
  - `--text-muted`: `#dfa8eb`
  - `--text-dim`: `#985ba6`
  - `--accent`: `#ff007f` (Laser Neon Magenta)
  - `--on-accent`: `#ffffff`
  - `--accent-strong`: `#ff3898`
  - `--accent-dim`: `#c20061`
  - `--accent-wash`: `rgba(255, 0, 127, 0.14)`
  - `--accent-line`: `rgba(255, 0, 127, 0.42)`
- **Light Mode (`.theme-light.palette-cyberpunk`):**
  - `--bg`: `#fdf2f8`
  - `--surface-1`: `#ffffff`
  - `--surface-2`: `#fce7f3`
  - `--surface-3`: `#fbcfe8`
  - `--rule`: `#f472b6`
  - `--rule-strong`: `#db2777`
  - `--text`: `#1e031b`
  - `--accent`: `#db2777`

---

## 3. Implementation Steps & Code Changes

### Step 1: Update `src/index.css`
Replace lines 12–96 in `src/index.css` to define the default root and the palette classes for both dark and light modes.

```css
/* ===================================================================
   INSTRUMENT PANEL — DESIGN TOKENS & MULTI-THEME PALETTES
   =================================================================== */

/* Default / Cyber-Optic Cyan (Dark) */
:root,
.palette-cyan {
  --bg: #05080f;
  --surface-1: #0a101d;
  --surface-2: #0f182a;
  --surface-3: #152238;
  --rule: #1b293d;
  --rule-strong: #283b54;
  --text: #e6f1fc;
  --text-muted: #8da0b6;
  --text-dim: #596c82;
  --accent: #00f2fe;
  --on-accent: #05080f;
  --accent-strong: #38bdf8;
  --accent-dim: #0284c7;
  --accent-wash: rgba(0, 242, 254, 0.1);
  --accent-line: rgba(0, 242, 254, 0.35);
  --ok: #35d6a0;
  --ok-wash: rgba(53, 214, 160, 0.1);
  --err: #ff6b5e;
  --heat-0: #0f182a;
  --heat-1: rgba(0, 242, 254, 0.22);
  --heat-2: rgba(0, 242, 254, 0.45);
  --heat-3: rgba(0, 242, 254, 0.7);
  --heat-4: #00f2fe;
  --r-sm: 2px;
  --r-md: 4px;
  --r-lg: 6px;
  --font-display: "Space Grotesk", "Inter", system-ui, sans-serif;
  --font-body: "Inter", system-ui, -apple-system, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  color-scheme: dark;
}

/* Light / Cyber-Optic Cyan */
.theme-light,
.theme-light.palette-cyan {
  --bg: #f0f4f9;
  --surface-1: #ffffff;
  --surface-2: #e8eff6;
  --surface-3: #dbe5f0;
  --rule: #cbd8e6;
  --rule-strong: #a8bccf;
  --text: #0b131e;
  --text-muted: #48596c;
  --text-dim: #687a8f;
  --accent: #0284c7;
  --on-accent: #ffffff;
  --accent-strong: #0369a1;
  --accent-dim: #38bdf8;
  --accent-wash: rgba(2, 132, 199, 0.08);
  --accent-line: rgba(2, 132, 199, 0.3);
  --ok: #0f7a56;
  --ok-wash: rgba(15, 122, 86, 0.1);
  --err: #b3261e;
  --heat-0: #dbe5f0;
  --heat-1: rgba(2, 132, 199, 0.22);
  --heat-2: rgba(2, 132, 199, 0.45);
  --heat-3: rgba(2, 132, 199, 0.7);
  --heat-4: #0284c7;
  color-scheme: light;
}

/* Amber — Signal Telemetry */
.palette-amber {
  --bg: #06080b;
  --surface-1: #0b0e13;
  --surface-2: #10151c;
  --surface-3: #161d26;
  --rule: #1c242e;
  --rule-strong: #2a3542;
  --text: #e7ecf3;
  --text-muted: #93a0b1;
  --text-dim: #5d6a7a;
  --accent: #ff9f1c;
  --on-accent: #0a0a0a;
  --accent-strong: #ffb54d;
  --accent-dim: #a86a10;
  --accent-wash: rgba(255, 159, 28, 0.1);
  --accent-line: rgba(255, 159, 28, 0.35);
  --heat-0: #131a22;
  --heat-1: rgba(255, 159, 28, 0.22);
  --heat-2: rgba(255, 159, 28, 0.45);
  --heat-3: rgba(255, 159, 28, 0.7);
  --heat-4: #ff9f1c;
}
.theme-light.palette-amber {
  --bg: #f4f6f8;
  --surface-1: #ffffff;
  --surface-2: #eef1f5;
  --surface-3: #e4e9ef;
  --rule: #d8dee6;
  --rule-strong: #b6c0cc;
  --text: #10161d;
  --text-muted: #4d5a68;
  --text-dim: #667080;
  --accent: #b25e00;
  --on-accent: #ffffff;
  --accent-strong: #8f4b00;
  --accent-dim: #d9922f;
  --accent-wash: rgba(178, 94, 0, 0.08);
  --accent-line: rgba(178, 94, 0, 0.3);
  --heat-0: #e4e9ef;
  --heat-1: rgba(178, 94, 0, 0.22);
  --heat-2: rgba(178, 94, 0, 0.45);
  --heat-3: rgba(178, 94, 0, 0.7);
  --heat-4: #b25e00;
}

/* Indigo — Neural Titanium */
.palette-indigo {
  --bg: #08090f;
  --surface-1: #0e101b;
  --surface-2: #141726;
  --surface-3: #1c2033;
  --rule: #22273e;
  --rule-strong: #333b5c;
  --text: #edf0fc;
  --text-muted: #969ec0;
  --text-dim: #606887;
  --accent: #6366f1;
  --on-accent: #ffffff;
  --accent-strong: #818cf8;
  --accent-dim: #4338ca;
  --accent-wash: rgba(99, 102, 241, 0.12);
  --accent-line: rgba(99, 102, 241, 0.35);
  --heat-0: #141726;
  --heat-1: rgba(99, 102, 241, 0.22);
  --heat-2: rgba(99, 102, 241, 0.45);
  --heat-3: rgba(99, 102, 241, 0.7);
  --heat-4: #6366f1;
}
.theme-light.palette-indigo {
  --bg: #f4f6fc;
  --surface-1: #ffffff;
  --surface-2: #edf0f9;
  --surface-3: #dfe4f4;
  --rule: #cfd6eb;
  --rule-strong: #aab6d8;
  --text: #0e1222;
  --text-muted: #4a5372;
  --text-dim: #6d7696;
  --accent: #4338ca;
  --on-accent: #ffffff;
  --accent-strong: #3730a3;
  --accent-dim: #6366f1;
  --accent-wash: rgba(67, 56, 202, 0.08);
  --accent-line: rgba(67, 56, 202, 0.3);
  --heat-0: #dfe4f4;
  --heat-1: rgba(67, 56, 202, 0.22);
  --heat-2: rgba(67, 56, 202, 0.45);
  --heat-3: rgba(67, 56, 202, 0.7);
  --heat-4: #4338ca;
}

/* Emerald — CUDA Matrix */
.palette-emerald {
  --bg: #040806;
  --surface-1: #08120c;
  --surface-2: #0e1c13;
  --surface-3: #14281b;
  --rule: #1b3524;
  --rule-strong: #274f36;
  --text: #e7f7ed;
  --text-muted: #8ebda0;
  --text-dim: #59856a;
  --accent: #00ff87;
  --on-accent: #040806;
  --accent-strong: #34d399;
  --accent-dim: #059669;
  --accent-wash: rgba(0, 255, 135, 0.1);
  --accent-line: rgba(0, 255, 135, 0.35);
  --heat-0: #0e1c13;
  --heat-1: rgba(0, 255, 135, 0.22);
  --heat-2: rgba(0, 255, 135, 0.45);
  --heat-3: rgba(0, 255, 135, 0.7);
  --heat-4: #00ff87;
}
.theme-light.palette-emerald {
  --bg: #f0f8f4;
  --surface-1: #ffffff;
  --surface-2: #e6f3ec;
  --surface-3: #d5e9df;
  --rule: #c2dfcf;
  --rule-strong: #9dc6af;
  --text: #08180e;
  --text-muted: #43614e;
  --text-dim: #658371;
  --accent: #047857;
  --on-accent: #ffffff;
  --accent-strong: #065f46;
  --accent-dim: #10b981;
  --accent-wash: rgba(4, 120, 87, 0.08);
  --accent-line: rgba(4, 120, 87, 0.3);
  --heat-0: #d5e9df;
  --heat-1: rgba(4, 120, 87, 0.22);
  --heat-2: rgba(4, 120, 87, 0.45);
  --heat-3: rgba(4, 120, 87, 0.7);
  --heat-4: #047857;
}

/* Crimson — Aerospace HUD */
.palette-crimson {
  --bg: #0b0708;
  --surface-1: #130c0e;
  --surface-2: #1d1215;
  --surface-3: #27181d;
  --rule: #362127;
  --rule-strong: #50303a;
  --text: #fce8eb;
  --text-muted: #c28f98;
  --text-dim: #875f66;
  --accent: #ff3366;
  --on-accent: #ffffff;
  --accent-strong: #fb7185;
  --accent-dim: #be123c;
  --accent-wash: rgba(255, 51, 102, 0.12);
  --accent-line: rgba(255, 51, 102, 0.35);
  --heat-0: #1d1215;
  --heat-1: rgba(255, 51, 102, 0.22);
  --heat-2: rgba(255, 51, 102, 0.45);
  --heat-3: rgba(255, 51, 102, 0.7);
  --heat-4: #ff3366;
}
.theme-light.palette-crimson {
  --bg: #fcf2f4;
  --surface-1: #ffffff;
  --surface-2: #f7e6e9;
  --surface-3: #ebd5d9;
  --rule: #dfc0c6;
  --rule-strong: #c49ba4;
  --text: #1e0a0e;
  --text-muted: #6e444c;
  --text-dim: #8e636b;
  --accent: #be123c;
  --on-accent: #ffffff;
  --accent-strong: #9f1239;
  --accent-dim: #f43f5e;
  --accent-wash: rgba(190, 18, 60, 0.08);
  --accent-line: rgba(190, 18, 60, 0.3);
  --heat-0: #ebd5d9;
  --heat-1: rgba(190, 18, 60, 0.22);
  --heat-2: rgba(190, 18, 60, 0.45);
  --heat-3: rgba(190, 18, 60, 0.7);
  --heat-4: #be123c;
}
```

---

### Step 2: Create `src/components/ui/ThemePaletteSelector.jsx`

Create a new file `src/components/ui/ThemePaletteSelector.jsx`:

```jsx
import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../../App';

export const THEMES = [
    {
        id: 'cyan',
        name: 'Cyber-Optic',
        label: 'LiDAR / Vision',
        color: '#00f2fe',
        dotClass: 'bg-[#00f2fe]'
    },
    {
        id: 'amber',
        name: 'Signal Telemetry',
        label: 'Instrument',
        color: '#ff9f1c',
        dotClass: 'bg-[#ff9f1c]'
    },
    {
        id: 'indigo',
        name: 'Neural Titanium',
        label: 'Frontier AI',
        color: '#6366f1',
        dotClass: 'bg-[#6366f1]'
    },
    {
        id: 'emerald',
        name: 'CUDA Matrix',
        label: 'HPC & Edge',
        color: '#00ff87',
        dotClass: 'bg-[#00ff87]'
    },
    {
        id: 'crimson',
        name: 'Aerospace HUD',
        label: 'Telemetry',
        color: '#ff3366',
        dotClass: 'bg-[#ff3366]'
    }
];

export const ThemePaletteSelector = ({ compact = false }) => {
    const { palette, setPalette, isDark } = useContext(ThemeContext);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const activeTheme = THEMES.find(t => t.id === palette) || THEMES[0];

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    return (
        <div className="relative inline-block" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Change color theme"
                aria-expanded={isOpen}
                className={`flex items-center gap-2 ${compact ? 'px-2 py-1' : 'px-2.5 py-1.5'} rounded border border-rule hover:border-accent transition-colors`}
                style={{ background: 'var(--surface-1)' }}
            >
                <span
                    className="w-2.5 h-2.5 rounded-full ring-2 ring-transparent transition-transform duration-200"
                    style={{
                        backgroundColor: activeTheme.color,
                        boxShadow: `0 0 8px ${activeTheme.color}80`
                    }}
                />
                <span className="font-mono text-xs text-ink uppercase tracking-wider hidden sm:inline">
                    {activeTheme.id}
                </span>
                <svg
                    className={`w-3 h-3 text-ink-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute right-0 top-full mt-2 w-56 p-1.5 rounded-md border border-rule-strong shadow-2xl z-50 backdrop-blur-md"
                        style={{ background: 'var(--surface-2)' }}
                    >
                        <div className="px-2.5 py-1.5 border-b border-rule mb-1 flex items-center justify-between">
                            <span className="font-mono text-[10px] uppercase tracking-label text-ink-dim">
                                Color Palette
                            </span>
                            <span className="font-mono text-[10px] text-accent">
                                5 Themes
                            </span>
                        </div>

                        <div className="flex flex-col gap-0.5">
                            {THEMES.map((theme) => {
                                const isSelected = theme.id === palette;
                                return (
                                    <button
                                        key={theme.id}
                                        onClick={() => {
                                            setPalette(theme.id);
                                            setIsOpen(false);
                                        }}
                                        className={`flex items-center justify-between px-2.5 py-2 rounded transition-all text-left group ${
                                            isSelected
                                                ? 'bg-accent-wash text-ink font-semibold'
                                                : 'hover:bg-surface-3 text-ink-muted hover:text-ink'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <span
                                                className="w-3 h-3 rounded-full flex-shrink-0 transition-transform group-hover:scale-110"
                                                style={{
                                                    backgroundColor: theme.color,
                                                    boxShadow: isSelected ? `0 0 10px ${theme.color}` : 'none'
                                                }}
                                            />
                                            <div>
                                                <div className="text-xs font-display leading-none">
                                                    {theme.name}
                                                </div>
                                                <div className="text-[10px] font-mono text-ink-dim mt-0.5">
                                                    {theme.label}
                                                </div>
                                            </div>
                                        </div>

                                        {isSelected && (
                                            <motion.span
                                                layoutId="theme-check"
                                                className="w-1.5 h-1.5 rounded-full bg-accent"
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
```

---

### Step 3: Update `src/App.jsx`

Update `src/App.jsx` to manage both `isDark` and `palette` state, saving to `localStorage`:

```jsx
import React, { useState, createContext, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActiveSection } from './hooks/useActiveSection';
import { useLang } from './hooks/useLang';

// Context definition with palette support
export const ThemeContext = createContext({
    isDark: true,
    setIsDark: () => {},
    palette: 'cyan',
    setPalette: () => {}
});

// UI & Section Components...
// ... (keep existing imports)

export default function App() {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme-mode');
        return saved !== null ? saved === 'dark' : true;
    });

    const [palette, setPalette] = useState(() => {
        const saved = localStorage.getItem('theme-palette');
        return saved || 'cyan';
    });

    const [splashDone, setSplashDone] = useState(() => sessionStorage.getItem('splashSeen') === '1');
    const activeSection = useActiveSection();
    const { lang, t, toggleLang } = useLang();
    const [voiceGuideReady, setVoiceGuideReady] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, []);

    // Idle chunk deferral for voice-guide
    useEffect(() => {
        const start = () => setVoiceGuideReady(true);
        if (typeof window.requestIdleCallback === 'function') {
            const id = window.requestIdleCallback(start, { timeout: 2000 });
            return () => window.cancelIdleCallback?.(id);
        }
        const id = setTimeout(start, 0);
        return () => clearTimeout(id);
    }, []);

    useEffect(() => {
        document.documentElement.lang = lang;
    }, [lang]);

    // Apply dark/light & palette classes to <html>
    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle('theme-light', !isDark);
        root.classList.toggle('theme-dark', isDark);
        localStorage.setItem('theme-mode', isDark ? 'dark' : 'light');
    }, [isDark]);

    useEffect(() => {
        const root = document.documentElement;
        const allPalettes = ['palette-cyan', 'palette-amber', 'palette-indigo', 'palette-emerald', 'palette-crimson'];
        allPalettes.forEach(cls => root.classList.remove(cls));
        root.classList.add(`palette-${palette}`);
        localStorage.setItem('theme-palette', palette);
    }, [palette]);

    return (
        <ThemeContext.Provider value={{ isDark, setIsDark, palette, setPalette }}>
            <AnimatePresence>
                {!splashDone && <SplashScreen key="splash" onComplete={() => { sessionStorage.setItem('splashSeen', '1'); setSplashDone(true); }} />}
            </AnimatePresence>
            <div className={`${isDark ? 'theme-dark' : 'theme-light'} palette-${palette} min-h-screen font-sans transition-colors duration-500 relative`}>
                <Header activeSection={activeSection} lang={lang} t={t} toggleLang={toggleLang} />
                
                <main>
                    <Hero t={t} />
                    <div className="section-divider"></div>
                    <AIAssistantSection t={t} />
                    <div className="section-divider"></div>
                    <CareerRoadmapSection t={t} />
                    <div className="section-divider"></div>
                    <SkillsSection t={t} />
                    <div className="section-divider"></div>
                    <GitHubSection t={t} />
                    <div className="section-divider"></div>
                    <ProjectsSection t={t} />
                    <div className="section-divider"></div>
                    <CertificationsSection t={t} />
                    <div className="section-divider"></div>
                    <ContactSection t={t} />
                </main>

                <Footer t={t} />
                <ScrollToTop />
                {splashDone && <AvatarGuide />}
                {voiceGuideReady && (
                    <Suspense fallback={null}>
                        <VoiceGuideMount />
                    </Suspense>
                )}
            </div>
        </ThemeContext.Provider>
    );
}
```

---

### Step 4: Update `src/components/ui/Header.jsx`

Mount `ThemePaletteSelector` inside desktop actions and mobile drawer:

```jsx
import { ThemePaletteSelector } from './ThemePaletteSelector';

// In Desktop Navigation actions area (lines ~79–88):
<div className="flex items-center gap-2.5 border-l border-rule pl-5">
    <ThemePaletteSelector />
    <LangToggle lang={lang} toggleLang={toggleLang} />
    <button
        onClick={() => setIsDark(!isDark)}
        className="w-8 h-8 rounded border border-rule flex items-center justify-center text-ink-muted hover:text-accent hover:border-accent transition-colors"
        aria-label="Toggle theme"
    >
        <ThemeIcon isDark={isDark} />
    </button>
</div>

// In Mobile Navigation actions area (lines ~91–108):
<div className="flex items-center gap-2 md:hidden">
    <ThemePaletteSelector compact />
    <LangToggle lang={lang} toggleLang={toggleLang} compact />
    <button
        onClick={() => setIsDark(!isDark)}
        className="w-8 h-8 rounded border border-rule flex items-center justify-center text-ink-muted hover:text-accent transition-colors z-50"
        aria-label="Toggle theme"
    >
        <ThemeIcon isDark={isDark} />
    </button>
    {/* Hamburger Menu Toggle */}
</div>
```

---

### Step 5: Update `src/components/ui/LidarSweep.jsx`

Make the HTML5 Canvas LiDAR beam dynamically adapt to the active `--accent` color:

```jsx
// Inside LidarSweep.jsx draw loop:
const computedStyle = getComputedStyle(canvas);
const accentColor = computedStyle.getPropertyValue('--accent').trim() || '#00f2fe';
const accentWash = computedStyle.getPropertyValue('--accent-wash').trim() || 'rgba(0,242,254,0.1)';

// In Range rings:
ctx.strokeStyle = accentWash;
ctx.lineWidth = 1;

// In points glow:
ctx.fillStyle = p.glow > 0.05 ? accentColor : 'rgba(255,255,255,0.2)';
```

---

## 4. Verification & Validation Checklist

- [ ] **Compilation**: Run `npm run build` — ensure 0 warnings and successful bundle.
- [ ] **Palette Switch**: Click all 5 themes in the Header dropdown; verify immediate visual update across navbar, hero, cards, badges, and heatmap.
- [ ] **Dark / Light Toggle**: Toggle light/dark in every palette to verify contrast, background elevation, and readability.
- [ ] **Storage Persistence**: Select `emerald` or `indigo`, refresh the page, verify that the theme persists immediately without flashing.
- [ ] **Mobile Drawer**: Open mobile menu on small screens and test theme selection.
- [ ] **Canvas Adaptation**: Observe the LiDAR rotating radar beam updating to match the active theme accent.
