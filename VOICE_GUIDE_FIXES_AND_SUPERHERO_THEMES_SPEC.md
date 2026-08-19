# SPECIFICATION & IMPLEMENTATION PLAN: VOICE GUIDE FIXES & SUPERHERO THEMES

**Target Project:** `react-portfolio`  
**Created:** 2026-08-19  
**Status:** Ready for Execution / Reference for Claude Code & Devs  

---

## 1. Executive Summary

This document specifies the root causes and exact implementation steps for three critical updates to the portfolio:
1. **Fix Avatar Bubble Clipping at Top**: Prevent the voice guide dialog bubble and persona selector from being cut off at the top of the viewport on Hero and early sections.
2. **Fix Hero Voice Audio Triggering**: Resolve the issue where narration audio does not play on page landing / Hero and only activates when the user scrolls down and interacts with the AI Assistant.
3. **Add 4 Iconic Superhero & Sci-Fi Engineering Themes**:
   - 🔴 **Stark Arc-Reactor (`ironman`)**: Hot-rod crimson & gold telemetry with titanium obsidian surfaces and arc-reactor laser glow.
   - 🟣 **Wakanda Vibranium (`vibranium`)**: Royal panther obsidian with kinetic neon violet/purple energy glow.
   - 🟡 **Gotham Tactical (`batman`)**: WayneTech matte carbon stealth with bat-signal amber/gold HUD.
   - 💖 **Neo Cyberpunk (`cyberpunk`)**: Midnight synthwave with neon laser magenta & electric cyan.

---

## 2. Issue 1: Avatar Dialog Bubble Top Clipping

### 2.1 Root Cause
1. In `src/components/ui/AvatarGuide.jsx`, `getPositions()` positioned the Hero step at `y: H * 0.30` (e.g. `240px` on an 800px viewport).
2. The dialogue bubble is positioned at `position: absolute; bottom: 100%; marginBottom: 8px;` (sitting directly above the avatar).
3. With `AgentControls` (guide prompt, 3 persona selector pills, unmute CTA, and explore hint) docked inside the bubble, its rendered height is ~300px–330px.
4. Top of bubble was landing at `240px - 320px = -80px` (80px above the top screen border).
5. The `tourSteps` array in `AvatarGuide.jsx` was also out of order compared to the actual DOM layout in `App.jsx` (`assistant` was listed as step 4 instead of step 1).

### 2.2 Solution
- Update `tourSteps` to strictly match the 8-section DOM sequence: `hero` -> `assistant` -> `roadmap` -> `skills` -> `github` -> `projects` -> `certifications` -> `contact`.
- Update `getPositions()` to keep the avatar anchored in the comfortable middle-lower viewport range (`H * 0.48` to `H * 0.54`, with `minY: 350px`).
- Update `safePos.y` calculation with `bubbleH = 340px` and enforce `y >= bubbleH + 20px`.
- Add `maxHeight: 'calc(100vh - 200px)'` and `overflowY: 'auto'` with a rich elevation drop-shadow to guarantee the bubble never clips on short viewports.

---

## 3. Issue 2: Audio Not Playing at the Beginning & Only Starting at AI Assistant

### 3.1 Root Cause
1. **Browser Autoplay Policies**: Modern browsers (Chrome, Edge, Safari) prohibit unmuted Web Audio / HTML5 audio playback until an explicit user interaction (`click`, `keydown`, `touchstart`).
2. **Wheel Scrolling is NOT a User Gesture**: In Chrome/Edge, mouse-wheel scrolling does not satisfy user activation.
3. **Deferred Activation Flow**:
   - A returning visitor with `vg:enabled = true` in localStorage had gesture listeners (`pointerdown`, `keydown`) registered.
   - If they scrolled down without clicking, the listeners stayed dormant on Hero.
   - When reaching the AI Assistant section and clicking an interactive chip or input, the `pointerdown` listener fired `engine.enable()`.
   - By then, `committedSectionId` was `'assistant'`, so Optimus/Jarvis immediately spoke the AI Assistant script instead of Hero.
4. **Initial Unmute Race**: If a visitor clicked "UNMUTE TOUR" during the initial lazy loading / 350ms settle window before `IntersectionObserver` committed `'hero'`, `committedSectionId` was `null`, causing `evaluate()` to exit without playing.

### 3.2 Solution
- In `src/voice-guide/narrationEngine.js`, initialize `committedSectionId` to `'hero'` if `window.scrollY < 250`.
- In `enable()`, if `committedSectionId` is empty, fallback to `'hero'` when near the top of the page.
- Pre-publish the initial caption for `'hero'` immediately so captions crossfade cleanly without delay.
- In `src/voice-guide/VoiceGuideProvider.jsx`, ensure the initial gesture arming evaluates and plays `'hero'` if the visitor is still at the top.

---

## 4. Feature 3: Adding Superhero & Sci-Fi Themes

### 4.1 Theme Token Specifications

#### 1. Stark Arc-Reactor (`ironman`)
- **Dark Mode (`.palette-ironman`):**
  - `--bg`: `#080406` (Deep Stark titanium charcoal)
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
  - `--ok-wash`: `rgba(255, 183, 3, 0.12)`
  - `--heat-4`: `#e63946`
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
  - `--accent-strong`: `#991b1b`
  - `--accent-dim`: `#dc2626`
  - `--accent-wash`: `rgba(185, 28, 28, 0.08)`
  - `--accent-line`: `rgba(185, 28, 28, 0.3)`

#### 2. Wakanda Vibranium (`vibranium`)
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
  - `--text-muted`: `#57476c`
  - `--text-dim`: `#76648e`
  - `--accent`: `#7e22ce`
  - `--on-accent`: `#ffffff`

#### 3. Gotham Tactical (`batman`)
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
  - `--accent`: `#eab308` (WayneTech Bat-Signal Gold)
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

#### 4. Neo Cyberpunk (`cyberpunk`)
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

## 5. File Modification Checklist

| File | Changes |
| :--- | :--- |
| `src/components/ui/AvatarGuide.jsx` | Fixed `tourSteps` order (8 sections), increased `bubbleH = 340`, adjusted `getPositions()` and `safePos.y` to avoid top clipping, added `maxHeight` and `overflowY` styling. |
| `src/voice-guide/narrationEngine.js` | Initialized `committedSectionId` to `'hero'` on top-of-page loads, added fallback in `enable()`, primed initial `'hero'` caption. |
| `src/index.css` | Added Dark & Light mode CSS token blocks for `.palette-ironman`, `.palette-vibranium`, `.palette-batman`, and `.palette-cyberpunk`. |
| `src/components/ui/ThemePaletteSelector.jsx` | Added the 4 new themes to `THEMES` array with labels and swatches; updated header badge to "9 Themes". |
| `src/App.jsx` | Added new palette names to `allPalettes` array (`ironman`, `vibranium`, `batman`, `cyberpunk`). |

---

## 6. Verification Steps

1. **Top Clipping**: Open portfolio on desktop / laptop. Confirm the dialog bubble stays below the navbar and all text ("I am Optimus Prime..."), buttons, and controls are 100% visible.
2. **Hero Audio**: Click "UNMUTE TOUR" while on Hero. Confirm Optimus Prime voice plays immediately.
3. **Themes**: Test all 9 themes in both Dark and Light mode via the Header palette selector. Confirm preferences persist on reload.
