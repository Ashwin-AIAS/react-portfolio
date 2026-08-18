# VOICE GUIDE PERSONAS, MOBILE MINI-PILL & CONSOLIDATED CONTROLS SPECIFICATION

**Project:** Ashwin Vignesh M — Portfolio (`react-portfolio`)  
**Feature:** Persona-Specific Avatars (Optimus / JARVIS / Ashwin), Mobile Dynamic Island Mini-Pill, and Consolidated Unmute Agent  
**Status:** Ready for Implementation  

---

## 1. Summary of Changes

This specification implements three key UX & visual enhancements to the portfolio's interactive Voice Guide:

1. **Persona-Specific Visuals & Animations:**
   - 🤖 **Optimus Prime:** Holographic Cybertronian Autobot Crest with glowing laser eyes and Matrix-of-Leadership energy rings that pulse with voice amplitude.
   - ⚡ **JARVIS:** Stark HUD Arc-Reactor with rotating concentric holographic rings and live frequency equalizer waveforms.
   - 🎙️ **Ashwin (Creator):** Retains the existing cartoon Memoji (`/avatar-emoji.png`) with animated mouth synchronization.
2. **Consolidated Agent Controls (Removing Detached Mute Pill):**
   - Eliminates the separate floating `[ 🔊 MUTE ]` box on the bottom-left.
   - Embeds the audio unlock prompt (*"🎙️ Audio tour available — Click to unmute"*) directly into the Avatar's initial speech bubble.
   - Docks the Mute button and Persona Selector cleanly at the base/header of the Agent widget.
3. **Mobile "Dynamic Island" Mini-Pill (Non-Intrusive Mobile Tour):**
   - On screens `< 768px`, replaces the screen-blocking desktop avatar with a sleek 38px bottom audio pill.
   - Shows active persona mini-icon, live equalizer bars, single-line scrolling caption, and tap-to-mute. Never obstructs page content.

---

## 2. Component Architecture

```
src/
└── voice-guide/
    └── components/
        ├── PersonaAvatar.jsx       <-- [NEW] Renders Optimus Hologram, JARVIS Arc-Reactor, or Ashwin Memoji
        ├── OptimusAvatarVisual.jsx <-- [NEW] SVG + CSS glow Autobot Crest with voice reactive eyes
        ├── JarvisAvatarVisual.jsx  <-- [NEW] SVG + CSS rotating Stark Arc-Reactor HUD
        ├── MobileVoicePill.jsx     <-- [NEW] 38px floating mobile Dynamic Island audio bar
        ├── CaptionBubble.jsx       <-- [UPDATED] With integrated unmute prompt & docked controls
        └── VoiceToggle.jsx         <-- [DEPRECATED / Merged into Avatar & Mobile Pill]
```

---

## 3. Detailed Component Implementations

### 3.1 `src/voice-guide/components/OptimusAvatarVisual.jsx`
Animated Autobot crest with real-time audio amplitude reactive glow:

```jsx
import React from 'react';

export const OptimusAvatarVisual = ({ size = 120 }) => (
  <div 
    className="relative flex items-center justify-center transition-transform duration-300"
    style={{ width: size, height: size }}
  >
    {/* Outer Cybertronian Energy Aura */}
    <div 
      className="absolute inset-0 rounded-full blur-md opacity-40 transition-opacity duration-150"
      style={{ 
        background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
        transform: 'scale(calc(1 + var(--vg-level, 0) * 0.4))'
      }}
    />

    {/* Autobot Insignia SVG */}
    <svg 
      viewBox="0 0 100 100" 
      className="w-full h-full drop-shadow-[0_0_15px_var(--accent)]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Armor Plates */}
      <path 
        d="M50 8 L85 24 L85 58 L72 88 L50 94 L28 88 L15 58 L15 24 Z" 
        stroke="var(--accent)" 
        strokeWidth="3" 
        fill="var(--surface-2)"
        fillOpacity="0.85"
      />
      
      {/* Brow & Forehead Crest */}
      <path 
        d="M32 24 L50 14 L68 24 L62 38 L38 38 Z" 
        fill="var(--accent)" 
        fillOpacity="0.3"
        stroke="var(--accent)"
        strokeWidth="2"
      />
      
      {/* Central Matrix V-Plates */}
      <path 
        d="M50 38 L50 72 M40 46 L28 54 M60 46 L72 54 M36 68 L28 78 M64 68 L72 78" 
        stroke="var(--accent)" 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />

      {/* Glowing Autobot Laser Eyes (Reacts to Speech Amplitude) */}
      <polygon 
        points="34,44 45,44 42,50 32,48" 
        fill="var(--accent-strong)"
        style={{
          filter: 'drop-shadow(0 0 calc(4px + var(--vg-level, 0) * 10px) var(--accent-strong))',
          opacity: 'calc(0.7 + var(--vg-level, 0) * 0.3)'
        }}
      />
      <polygon 
        points="66,44 55,44 58,50 68,48" 
        fill="var(--accent-strong)"
        style={{
          filter: 'drop-shadow(0 0 calc(4px + var(--vg-level, 0) * 10px) var(--accent-strong))',
          opacity: 'calc(0.7 + var(--vg-level, 0) * 0.3)'
        }}
      />

      {/* Mouth Guard / Speaker Grille */}
      <path 
        d="M42 64 L58 64 M44 70 L56 70 M46 76 L54 76" 
        stroke="var(--accent)" 
        strokeWidth="2" 
        strokeLinecap="round"
        style={{
          transform: 'scaleY(calc(1 + var(--vg-level, 0) * 0.8))',
          transformOrigin: '50% 70%'
        }}
      />
    </svg>
  </div>
);
```

---

### 3.2 `src/voice-guide/components/JarvisAvatarVisual.jsx`
Holographic Stark Arc-Reactor & HUD Waveform Orb:

```jsx
import React from 'react';

export const JarvisAvatarVisual = ({ size = 120 }) => (
  <div 
    className="relative flex items-center justify-center"
    style={{ width: size, height: size }}
  >
    {/* Ambient Arc Glow */}
    <div 
      className="absolute inset-0 rounded-full blur-lg opacity-35"
      style={{ 
        background: 'radial-gradient(circle, #38bdf8 0%, #6366f1 50%, transparent 75%)',
        transform: 'scale(calc(0.9 + var(--vg-level, 0) * 0.5))'
      }}
    />

    {/* Rotating Concentric HUD Rings */}
    <svg 
      viewBox="0 0 100 100" 
      className="w-full h-full"
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Tech Ring */}
      <circle 
        cx="50" cy="50" r="44" 
        stroke="#38bdf8" 
        strokeWidth="1.5" 
        strokeDasharray="6 3 2 3" 
        className="animate-[spin_20s_linear_infinite]"
        style={{ opacity: 0.6 }}
      />
      
      {/* Counter-rotating Segment Ring */}
      <circle 
        cx="50" cy="50" r="36" 
        stroke="#818cf8" 
        strokeWidth="2" 
        strokeDasharray="14 10" 
        className="animate-[spin_12s_linear_infinite_reverse]"
        style={{ opacity: 0.8 }}
      />

      {/* Inner Hexagonal Core */}
      <polygon 
        points="50,22 74,36 74,64 50,78 26,64 26,36" 
        stroke="#38bdf8" 
        strokeWidth="2" 
        fill="#0a101d"
        fillOpacity="0.8"
      />

      {/* Triangular Arc Reactor Nodes */}
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <line
          key={deg}
          x1="50" y1="50"
          x2={50 + 20 * Math.cos((deg * Math.PI) / 180)}
          y2={50 + 20 * Math.sin((deg * Math.PI) / 180)}
          stroke="#38bdf8"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ opacity: 'calc(0.5 + var(--vg-level, 0) * 0.5)' }}
        />
      ))}

      {/* Center Glowing Core */}
      <circle 
        cx="50" cy="50" r="8" 
        fill="#38bdf8"
        style={{
          filter: 'drop-shadow(0 0 calc(6px + var(--vg-level, 0) * 14px) #38bdf8)',
          transform: 'scale(calc(0.85 + var(--vg-level, 0) * 0.6))',
          transformOrigin: '50% 50%'
        }}
      />
    </svg>
  </div>
);
```

---

### 3.3 `src/voice-guide/components/PersonaAvatar.jsx`
Switches dynamically based on the active persona:

```jsx
import React from 'react';
import avatarEmoji from '/avatar-emoji.png';
import { OptimusAvatarVisual } from './OptimusAvatarVisual';
import { JarvisAvatarVisual } from './JarvisAvatarVisual';
import { AvatarMouth } from './AvatarMouth';

export const PersonaAvatar = ({ persona = 'ashwin', size = 110 }) => {
  if (persona === 'optimus') {
    return <OptimusAvatarVisual size={size} />;
  }
  if (persona === 'jarvis') {
    return <JarvisAvatarVisual size={size} />;
  }
  // Default Creator (Ashwin) - keeps original cartoon Memoji
  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <img
        src={avatarEmoji}
        alt="Ashwin Avatar"
        className="w-full h-full object-contain pointer-events-none drop-shadow-[0_0_12px_var(--accent-line)]"
        draggable={false}
      />
      <AvatarMouth />
    </div>
  );
};
```

---

### 3.4 `src/voice-guide/components/MobileVoicePill.jsx`
Sleek 38px bottom Dynamic Island bar for mobile screens:

```jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceGuide } from '../useVoiceGuide';

export const MobileVoicePill = () => {
  const { ready, enabled, persona, toggle, setPersona, activeText, isSpeaking } = useVoiceGuide();

  if (!ready) return null;

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-4 left-4 right-4 z-40 md:hidden flex items-center justify-between px-3.5 py-2 rounded-full border border-rule-strong backdrop-blur-lg shadow-xl"
      style={{ background: 'var(--surface-1)' }}
    >
      {/* Persona Icon & Status */}
      <button 
        onClick={toggle}
        className="flex items-center gap-2.5 flex-1 min-w-0 text-left"
      >
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-accent animate-pulse" />
        
        {/* Scrolling text / status */}
        <div className="min-w-0 flex-1 truncate">
          <span className="font-mono text-[10px] text-accent uppercase tracking-wider block">
            {persona === 'optimus' ? 'OPTIMUS PRIME' : persona === 'jarvis' ? 'JARVIS AI' : 'ASHWIN GUIDE'}
          </span>
          <span className="font-sans text-xs text-ink truncate block">
            {enabled ? (activeText || "Scroll to explore sections...") : "Tap to enable audio tour"}
          </span>
        </div>
      </button>

      {/* Mute/Unmute Quick Toggle */}
      <button
        onClick={toggle}
        className={`ml-2.5 px-3 py-1 rounded-full font-mono text-[11px] font-semibold border transition-all ${
          enabled 
            ? 'bg-accent text-bg border-accent' 
            : 'border-rule text-ink-muted hover:text-ink'
        }`}
      >
        {enabled ? 'MUTE' : 'UNMUTE'}
      </button>
    </motion.div>
  );
};
```

---

### 3.5 Consolidated Desktop Agent & Bubble (`AvatarGuide.jsx`)

1. **When Audio is Muted:** The initial bubble displays:
   - Header badge: `[ AUDIO BRIEFING READY ]`
   - Prompt: *"Select your guide and click to start the audio tour."*
   - Interactive **Unmute Button**: `[ 🔊 Unmute Tour ]` with pulse ring.
   - Persona pills: `[ Optimus ] [ JARVIS ] [ Ashwin ]`
2. **When Audio is Unmuted:**
   - Displays live section narration text with audio progress bar.
   - Persona selector and Mute toggle sit neatly at the top/bottom bar of the bubble.
3. **No detached bottom-left floating box.**

---

## 4. Claude Code Implementation Prompt

```markdown
Please implement the persona-specific visuals, mobile dynamic island pill, and consolidated unmute agent detailed in VOICE_GUIDE_PERSONAS_AND_MOBILE_SPEC.md:

1. Create `src/voice-guide/components/OptimusAvatarVisual.jsx` (Autobot Crest with audio-reactive glowing eyes).
2. Create `src/voice-guide/components/JarvisAvatarVisual.jsx` (Stark Arc-Reactor HUD with rotating rings).
3. Create `src/voice-guide/components/PersonaAvatar.jsx` to dynamically render Optimus visual, JARVIS visual, or the original Ashwin Memoji based on the active persona.
4. Create `src/voice-guide/components/MobileVoicePill.jsx` for mobile screens (< 768px).
5. Update `AvatarGuide.jsx` and `CaptionBubble.jsx` to:
   - Use `<PersonaAvatar persona={voice.persona} />`.
   - Incorporate the Unmute prompt, Mute button, and Persona selector directly into the Agent widget.
   - Remove the separate detached bottom-left floating VoiceToggle box.
6. Verify the build with `npm run build` ensuring 0 errors.
```
