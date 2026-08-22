# HOLOGRAPHIC TOUR AGENT & SCI-FI HUD SPECIFICATION

**Target Project:** `react-portfolio`  
**Feature:** Holographic AI Companion & Sci-Fi Glassmorphic HUD Overhaul  
**Status:** Ready for Execution via Claude Code & Devs  

---

## 1. Executive Summary & Objective

Transform the portfolio's interactive Voice Tour Agent into an extraordinary, futuristic, non-ordinary AI Companion featuring:
1. **Ashwin Memoji Hologram Pedestal (Creator Persona)**: Retains Ashwin's cartoon Memoji (`/avatar-emoji.png`) and mouth lip-sync, augmented with a rotating holographic emitter ring, audio-reactive soundwave orbital halo, and ambient particle glow.
2. **Optimus Prime Cybertronian Battle Matrix**: Adds Cybertronian holographic scanlines, lens diffraction spikes on laser optics that flare with voice amplitude, 3D armor bevel depth, and an enhanced Matrix resonance ring.
3. **JARVIS Stark Arc-Reactor (Mark 85)**: Adds 3D gyroscopic telemetry rings with degree markers, radiating sonic equalizer shockwave rings, and vibrating laser containment pylons.
4. **Megatron Dark Energon Gladiator**: Adds rotating Fusion Cannon crosshairs, Dark Energon plasma charge arcs, and glowing vocoder exhaust vents.
5. **Sci-Fi Glassmorphic HUD Dialogue Terminal (`AvatarGuide.jsx` & `CaptionBubble.jsx`)**:
   - Ultra-crisp frosted glass backdrop with telemetry corner accents (`┌ ┐ └ ┘`).
   - Real-time animated audio spectrum waveform visualizer in the transmission header.
   - Live telemetry status pill (`[ ● LIVE TRANSMISSION ]`).
   - Polished persona pills with neon active borders and sound indicator icons.
   - Enhanced Unmute CTA with pulsing soundwave ripple.
6. **Smooth Anti-Gravity Levitation**: Fluid hovering and drifting motion with holographic projection base beam.
7. **Task-by-Task Atomic Commits & Final Push**: Commit after each logical task and perform a final `git push origin main`.

---

## 2. Detailed Technical Requirements

### 2.1 Persona Avatar Enhancements (`src/voice-guide/components/`)

#### 1. Ashwin Memoji (`PersonaAvatar.jsx`):
- Preserve `<img src={avatarEmoji} />` and `<AvatarMouth active={speaking} />`.
- Add a base holographic projection beam SVG/CSS element beneath the Memoji (`.vg-holo-pedestal`).
- Add an outer orbital soundwave halo (`.vg-ashwin-halo`) that pulses and expands with `--vg-level`.

#### 2. Optimus Prime (`OptimusAvatarVisual.jsx`):
- Add laser eye diffraction flares (`polygon` / `line` cross-spikes) with `opacity: calc(0.6 + var(--vg-level) * 0.4)` and dynamic drop-shadow bloom.
- Add Cybertronian scanline overlay (`strokeDasharray="1 3" opacity="0.35"`).
- Maintain 100% theme adaptability using `var(--accent)`, `var(--accent-strong)`, `var(--surface-1)`, and `var(--surface-2)`.

#### 3. JARVIS (`JarvisAvatarVisual.jsx`):
- Add rotating gyroscopic telemetry circles with cardinal degree tags (`0°`, `90°`, `180°`, `270°`) and nano-grid ticks.
- Add live radial equalizer soundwave shockwave rings that expand outward on speech (`scale(calc(0.9 + var(--vg-level) * 0.7))`).

#### 4. Megatron (`MegatronAvatarVisual.jsx`):
- Add rotating Fusion Cannon reticle dial with 4 crosshair plasma charge points.
- Add Dark Energon spark core diamond with amplitude-driven violet/crimson flare.

---

### 2.2 Sci-Fi HUD Dialogue Card (`AvatarGuide.jsx` & `CaptionBubble.jsx`)

#### 1. Glassmorphic HUD Terminal (`AvatarGuide.jsx`):
- Replace basic solid bubble styles with:
  ```css
  background: rgba(10, 15, 29, 0.85); /* theme-adaptive via var(--surface-1) */
  backdrop-filter: blur(16px);
  border: 1px solid var(--accent-line);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55), 0 0 20px var(--accent-wash);
  ```
- Add sci-fi glowing corner bracket accents:
  - Top-left: `border-top: 2px solid var(--accent); border-left: 2px solid var(--accent);`
  - Bottom-right: `border-bottom: 2px solid var(--accent); border-right: 2px solid var(--accent);`
- Add anti-gravity floating animation on the outer guide wrapper (`y: [0, -10, 2, -8, 0]` with slight sine rotation `rotate: [0, -1.5, 1.5, 0]`).

#### 2. Transmission Header & Equalizer (`CaptionBubble.jsx`):
- Render live audio spectrum waveform (5 animated mini-bars) next to the Persona Transmission badge when `enabled` is true.
- Badge text switches between `[ ● LIVE TRANSMISSION // OPTIMUS PRIME ]`, `[ ● LIVE TRANSMISSION // JARVIS AI ]`, `[ ● LIVE TRANSMISSION // MEGATRON ]`, and `[ AUDIO BRIEFING READY ]`.

---

### 2.3 Mobile Dynamic Island Mini-Pill (`MobileVoicePill.jsx`)

- Refine mobile pill with glowing perimeter border beam, animated 4-bar equalizer, and smooth persona switcher dropdown.

---

### 2.4 CSS Keyframe Animations (`src/voice-guide/voice-guide.css`)

Add the following GPU-accelerated keyframe animations:
- `@keyframes vg-holo-scanline`
- `@keyframes vg-pedestal-sweep`
- `@keyframes vg-spectrum-pulse`
- `@keyframes vg-corner-glow`
- `@keyframes vg-levitate`

---

## 3. Git Workflow & Commit Sequence

Execute the changes in 3 atomic tasks:

1. **Commit 1**:
   `git commit -m "feat(voice-guide): enhance Persona avatars with holographic effects and audio-reactive visuals"`
   - Files: `PersonaAvatar.jsx`, `OptimusAvatarVisual.jsx`, `JarvisAvatarVisual.jsx`, `MegatronAvatarVisual.jsx`

2. **Commit 2**:
   `git commit -m "feat(voice-guide): upgrade dialogue bubble to sci-fi glassmorphic HUD with telemetry accents"`
   - Files: `AvatarGuide.jsx`, `CaptionBubble.jsx`, `voice-guide.css`

3. **Commit 3**:
   `git commit -m "feat(voice-guide): polish mobile Dynamic Island mini-pill and floating anti-gravity animations"`
   - Files: `MobileVoicePill.jsx`, `voice-guide.css`

4. **Final Step**:
   - Run `npm run build` to verify 0 errors.
   - Run `git push origin main`.
