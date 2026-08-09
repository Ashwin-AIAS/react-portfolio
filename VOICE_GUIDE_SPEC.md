# Voice Guide Agent — Autonomous Implementation Spec

**For:** Claude Code, running inside Ashwin's React portfolio repo.
**Goal:** Turn the existing static avatar into a scroll-aware narrator that speaks the visitor through the portfolio, with visible mouth movement, and that stays correctly in sync when the visitor scrolls up, down, fast, or jumps around.

Work through the phases in order. Do not skip Phase 0. Run the acceptance tests in §10 before the git steps in §11.

---

## 1. Hard rules — read before touching anything

1. **Surgical edits only.** Do not restructure, reformat, or "clean up" existing components. Add new isolated modules. Where you must touch an existing file, make the smallest possible insertion and leave surrounding code byte-identical.
2. **Do not rewrite existing copy.** Section headings, project descriptions, and bio text stay exactly as they are. If you need narration text, derive it or use the placeholders in §9 and flag them for review.
3. **Never autoplay with sound.** Browsers block it and it will fail silently in production. Audio only ever starts after a genuine user gesture (`pointerdown`, `keydown`, `touchstart`). **Scroll is not a user activation gesture in Chrome** — do not rely on it.
4. **Captions are the primary channel; voice is the enhancement.** Everything the avatar says must be readable on screen. The site must be fully usable and pleasant with audio permanently off.
5. **No API keys in the client.** If you reach for a TTS API, stop and use the fallback in §5.3 instead.
6. **Default state is muted.** A visitor who never clicks anything gets a silent, captioned tour. This is deliberate — recruiters open portfolios in open-plan offices.
7. **Do not commit secrets, `.env`, or `node_modules`.** Check `.gitignore` before the first commit.

---

## 2. Phase 0 — Discovery (no code yet)

Inventory the repo and write your findings to `docs/voice-guide/DISCOVERY.md`. Answer:

- Build tool (Vite / CRA / Next?), React version, TypeScript or JS, styling system (Tailwind? CSS modules? styled-components?).
- Where the avatar component lives, what it renders (`<img>`? `<canvas>`? Lottie? sprite sheet?), and its exact file path.
- Where the current welcome bubble ("Hey! I'm Ashwin — welcome! Let me show you around.") is implemented, including how the dot-pagination and the `×` dismiss work.
- The list of top-level page sections in document order, with the DOM node or component that wraps each, and whether each already has a stable `id`.
- Any existing scroll listeners, `IntersectionObserver` usage, scroll-spy nav, or animation libraries (Framer Motion? GSAP? react-intersection-observer?). **Reuse what exists rather than adding a competing scroll system.**
- Whether any audio assets already exist under `public/`.
- Whether `gh` (GitHub CLI) is available and what `git remote -v` returns.

Only after this file is written, proceed.

> Note: dev environment is **Windows / PowerShell**. Don't chain shell commands with `&&` in scripts you write; use separate lines or `;`.

---

## 3. Architecture

### 3.1 File layout (create these)

```
src/voice-guide/
  index.ts                     # public exports
  VoiceGuideProvider.tsx       # context + state machine host
  useVoiceGuide.ts             # consumer hook
  useScrollTracker.ts          # scrollY, velocity, direction
  useActiveSection.ts          # IntersectionObserver -> active section id
  narrationEngine.ts           # state machine, policy decisions
  sources/
    NarrationSource.ts         # interface
    AudioFileSource.ts         # mp3 + WebAudio analyser
    SpeechSynthesisSource.ts   # zero-asset fallback
  components/
    AvatarMouth.tsx            # amplitude -> mouth/glow
    CaptionBubble.tsx          # replaces/extends existing bubble
    VoiceToggle.tsx            # the unmute pill + mute control
  data/
    narrationScript.ts         # section registry (single source of truth)
  utils/
    amplitude.ts               # smoothing, silence gate
    storage.ts                 # session/local persistence, SSR-safe
docs/voice-guide/
  DISCOVERY.md
  RECORDING_GUIDE.md
public/audio/narration/        # empty at first, .gitkeep
```

### 3.2 Section registry — the single source of truth

`src/voice-guide/data/narrationScript.ts`:

```ts
export interface NarrationClip {
  text: string; // caption text, always shown
  audio?: string; // /audio/narration/<file>.mp3 — optional
  estimatedMs?: number; // used only by the SpeechSynthesis fallback
}

export interface NarratedSection {
  id: string; // must match the DOM element id
  order: number; // document order, 0-based
  label: string; // human name, for the debug overlay
  intro: NarrationClip[]; // played on first meaningful entry
  revisit?: NarrationClip; // short line on 2nd entry
  // 3rd+ entry: silent
}

export const NARRATION: NarratedSection[] = [
  /* §9 */
];
```

Every narrated section element gets `id="<id>"` and `data-narrate="<id>"`. Add the attribute; do not change existing ids that are already used by the nav.

### 3.3 State machine

States: `disabled` → `armed` → `speaking` → `settling` → `armed`, with `suspended` for hidden tabs.

| From        | Event                                          | To          | Side effect                                                            |
| ----------- | ---------------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| `disabled`  | user clicks voice toggle                       | `armed`     | create + resume `AudioContext`, persist `enabled=true`                 |
| `armed`     | section committed (§4.3) and policy says speak | `speaking`  | load clip, play, start amplitude loop                                  |
| `speaking`  | clip ends naturally                            | `settling`  | mark section `completed`, 600ms cooldown                               |
| `speaking`  | different section committed                    | `speaking`  | fade out 250ms, mark current `partial`, start new clip                 |
| `speaking`  | user hits mute / `Esc`                         | `disabled`  | fade out 200ms, persist `enabled=false`                                |
| `speaking`  | `visibilitychange` → hidden                    | `suspended` | pause, remember clip index                                             |
| `suspended` | tab visible                                    | `armed`     | **restart the current clip from its beginning**, never resume mid-word |
| `settling`  | 600ms elapsed                                  | `armed`     | —                                                                      |

Captions follow the same transitions and render in **all** states including `disabled` — the caption bubble is driven by the active section, not by the audio.

---

## 4. Phase 1 — Scroll tracking and section resolution

This is the part that has to not get confused. Implement it exactly.

### 4.1 `useScrollTracker`

- Sample `window.scrollY` inside a single `requestAnimationFrame` loop. No `scroll` event listeners with heavy work.
- `velocity` = exponential moving average of `|Δy| / Δt` in px/s, smoothing factor `0.2`.
- `direction`: `'down' | 'up' | 'idle'`, with a **4px deadzone** so trackpad jitter doesn't flip it.
- Expose `isSettled` = `velocity < 60` for at least `SETTLE_MS`.

### 4.2 `useActiveSection`

- One `IntersectionObserver` over all `[data-narrate]` elements.
- `threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]`
- `rootMargin: '-15% 0px -40% 0px'` — biases toward the section occupying the upper-middle of the viewport, which is where the reader's eye is.
- Keep a live `Map<sectionId, intersectionRatio>`.
- `candidate` = the id with the highest ratio. Tie-break: if `direction === 'down'`, prefer the later section in document order; if `'up'`, prefer the earlier one. This is what makes reversing direction feel correct instead of sticky.

### 4.3 Committing a section change

A candidate only becomes the **committed active section** when _all_ hold:

- it has been the candidate continuously for `SETTLE_MS = 350ms`
- `velocity < FAST_SCROLL = 900` px/s
- it differs from the current committed section

**Never queue.** If the visitor blasts through five sections, four of them are never committed and nothing is spoken for them. On arrival, only the section they actually landed on speaks. Queuing is the single biggest way this feature goes wrong.

### 4.4 Narration policy

Given a committed section, consult `sessionStorage` visit records:

| Visit state                                         | Direction                | Action                                      |
| --------------------------------------------------- | ------------------------ | ------------------------------------------- |
| never visited                                       | any                      | play full `intro` clip list                 |
| visited but `partial` (they scrolled away mid-clip) | any                      | play full `intro` again from the start      |
| `completed`, visit count 1                          | any                      | play `revisit` clip if defined, else silent |
| `completed`, visit count ≥ 2                        | any                      | silent — captions only                      |
| any                                                 | `velocity ≥ FAST_SCROLL` | suppressed, no state change                 |

Record shape: `{ [sectionId]: { count: number, status: 'partial' | 'completed' } }` in `sessionStorage` under `vg:visits`. Session, not local — a recruiter returning next week should get the full tour again.

### 4.5 The intro

The hero/intro clip is special: it fires on **audio unlock**, not on scroll. Sequence:

1. Page load → caption bubble shows the welcome text, silent, with the pulsing voice toggle visible.
2. Visitor clicks the toggle → `AudioContext` resumes → hero clip plays immediately.
3. If the visitor has already scrolled past the hero before enabling, skip the hero clip and speak the current section instead. Do not drag them backwards.

---

## 5. Phase 2 — Narration engine and audio sources

### 5.1 The interface

```ts
export interface NarrationSource {
  isAvailable(): boolean;
  prepare(clip: NarrationClip): Promise<void>;
  play(
    clip: NarrationClip,
    cb: {
      onAmplitude: (level: number) => void; // 0..1, called per rAF
      onWord?: (charIndex: number) => void; // optional caption highlight
      onEnd: (completed: boolean) => void;
    },
  ): Promise<void>;
  stop(fadeMs: number): Promise<void>;
}
```

The engine picks the first available source: `AudioFileSource` if the clip has an `audio` path and the file resolves (HEAD request or `canplaythrough` with timeout), else `SpeechSynthesisSource`, else caption-only mode. This means **the whole feature works and is testable today with zero audio assets.**

### 5.2 `AudioFileSource`

- `HTMLAudioElement` → `createMediaElementSource` → `AnalyserNode` (`fftSize: 256`, `smoothingTimeConstant: 0.6`) → destination.
- Per frame: `getByteTimeDomainData`, compute RMS, normalise against a running peak, clamp to `0..1`.
- Silence gate: RMS below `0.02` → emit `0` so the mouth fully closes between words.
- Fade out = `GainNode.gain.linearRampToValueAtTime` over the requested ms, then `pause()`.
- Preload strategy: `preload="none"` by default; when a section commits, prefetch the audio for the **next** section in document order only.

### 5.3 `SpeechSynthesisSource` (fallback — build this first, it unblocks everything)

- `window.speechSynthesis` + `SpeechSynthesisUtterance`.
- Pick a voice: prefer `en-IN`, then `en-GB`, then any `en-*`. Rate `0.95`, pitch `1.0`.
- No analyser is possible here, so **synthesise** amplitude: use the `onboundary` event to detect word starts and drive an envelope — attack to `0.7 + random(0.3)` over 60ms, decay to `0.1` over the estimated word duration. It reads convincingly as speech.
- Known quirk: Chrome cancels long utterances after ~15s. Keep every clip under 12 seconds, or split it. Also call `speechSynthesis.cancel()` on unmount and on `beforeunload`.

### 5.4 Interruption

`stop(250)` must be idempotent and awaited before the next `play()` starts. Race conditions here produce two voices talking over each other — guard with a monotonically increasing `playToken`; any callback whose token is stale is discarded.

---

## 6. Phase 3 — Avatar mouth and captions

### 6.1 Mouth

Inspect what the avatar actually is (Phase 0), then:

- **If mouth sprite frames exist:** swap between closed / half / open at amplitude thresholds `0.15` / `0.45`.
- **If it's a single static image (most likely):** overlay an absolutely-positioned SVG mouth shape aligned to the avatar's mouth, and drive `scaleY` from `0.12` to `1.0`. Put the avatar and overlay in a shared positioned wrapper so they scale together responsively. Get the alignment right at one breakpoint, then use percentage-based positioning.

Smoothing, in `utils/amplitude.ts`: lerp toward the target with **attack 0.5, release 0.18**. Fast open, slower close — that's what makes it look like a mouth rather than a flickering shape.

Secondary motion, all driven off the same amplitude value via CSS custom properties (`--vg-level`):

- glow ring intensity around the avatar
- head bob: `translateY(calc(var(--vg-level) * -2px))`
- a subtle idle breathing animation when `level === 0` and state is `armed`

Under `prefers-reduced-motion: reduce`: keep the mouth, drop the bob and glow pulse.

### 6.2 Captions

- Extend the **existing** bubble component rather than replacing it. Keep its current visual design, dot pagination, and `×` dismiss behaviour.
- Text swaps with a 150ms crossfade when the clip changes.
- `aria-live="polite"` on the bubble, `aria-atomic="true"`.
- Dismissing with `×` hides the bubble **and** stops narration and sets `enabled=false` — one clear off switch.

---

## 7. Phase 4 — Controls and persistence

`VoiceToggle` renders a small pill near the avatar:

- Off state: speaker-muted icon, label "Play voice tour", gentle pulse animation to draw the eye (stop pulsing after first interaction, ever, via `localStorage`).
- On state: animated speaker icon, click to mute.
- Keyboard: focusable, `Enter`/`Space` toggles, `Esc` anywhere on the page mutes.

Persistence via `utils/storage.ts`, all wrapped in try/catch (Safari private mode throws):

| Key             | Store          | Purpose                           |
| --------------- | -------------- | --------------------------------- |
| `vg:enabled`    | localStorage   | remembered across visits          |
| `vg:pulse-seen` | localStorage   | don't pulse at returning visitors |
| `vg:visits`     | sessionStorage | per-section visit records         |

Also: if `navigator.connection?.saveData === true`, start disabled and don't preload any audio.

---

## 8. Phase 5 — Performance, a11y, dev tooling

- The voice guide must not affect LCP. Lazy-load the whole `voice-guide` bundle with `React.lazy` after first paint (`requestIdleCallback`, fallback `setTimeout(0)`).
- No audio file is fetched until the visitor enables voice.
- Total audio budget: **under 5 MB**. Encode mono MP3 at 96 kbps. If it exceeds that, switch to Git LFS and say so in your report.
- SSR-safe: guard every `window`, `document`, `navigator`, and `sessionStorage` access.
- Add a debug overlay behind `?vgdebug=1` showing: committed section, candidate, all intersection ratios, velocity, direction, state machine state, current amplitude. You will need this to tune the constants — and so will Ashwin.
- Export the tuning constants from one file, `voice-guide/config.ts`: `SETTLE_MS`, `FAST_SCROLL`, `COOLDOWN_MS`, fade durations, rootMargin, amplitude attack/release.

---

## 9. Narration script — placeholders, flag for review

Write these into `narrationScript.ts` **as placeholders**. Do not invent facts about Ashwin's projects, employers, or results — pull phrasing from the copy already on the page where possible, and mark anything you had to guess with a `// TODO: review` comment.

| Section            | Intro (target 8–12s)                                                                            | Revisit (target 3s)                                 |
| ------------------ | ----------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| hero               | "Hey, I'm Ashwin — welcome. Let me show you around. Just scroll, and I'll walk you through it." | "Back at the top."                                  |
| about              | Who he is, what he's studying, what he's looking for.                                           | "Bit more about me."                                |
| skills / ai-system | "This one's my favourite — try the AI system below, it's live, go ahead and ask it something."  | "The AI system's still live if you want to try it." |
| projects           | What to look at first and why.                                                                  | "More projects here."                               |
| roadmap / career   | The trajectory in one sentence.                                                                 | "The roadmap."                                      |
| contact            | A direct, warm close and what to do next.                                                       | "Get in touch here."                                |

Tone guidance: this should sound like a master's student talking, not a corporate voiceover. Short sentences. Contractions. No "leveraging", no "passionate about", no "cutting-edge". If a line sounds like a LinkedIn post, rewrite it.

Then write `docs/voice-guide/RECORDING_GUIDE.md` covering:

- the exact filenames expected in `public/audio/narration/` (derived from the registry)
- that recording on a phone in a quiet room beats any TTS for authenticity
- ffmpeg one-liner to convert to mono 96 kbps MP3
- that dropping files in requires no code change — the engine picks them up automatically

---

## 10. Acceptance tests — all must pass before §11

Run the dev server and verify by hand. Record pass/fail for each in your final report.

1. Cold load, no clicks: page is silent, caption bubble visible, voice pill pulsing. **Zero autoplay errors in console.**
2. Click the pill: hero line speaks, mouth moves in sync with the audio, mouth fully closes between words.
3. Scroll slowly down through every section: each speaks exactly once, no overlap, no double voices.
4. Scroll fast from top to bottom in under a second: **nothing speaks during the scroll**; only the final landing section speaks, once, after you stop.
5. Scroll down two sections then back up: the earlier section gives the short revisit line, not the full intro again.
6. Scroll away mid-sentence, then come back: the section replays from the beginning, not the middle.
7. Visit the same section a third time: silent, captions still update.
8. Mute mid-sentence: audio fades out cleanly in ~200ms, captions keep working, state persists across reload.
9. Switch browser tabs mid-sentence and come back: the line restarts from its beginning, no overlap.
10. Mobile viewport (375px) and real touch scrolling: mouth stays aligned to the avatar, pill is reachable, nothing overflows.
11. `prefers-reduced-motion: reduce` in devtools: no bob, no glow pulse, mouth still works.
12. Delete/rename an audio file: falls back to speech synthesis with no crash. Disable speech synthesis: falls back to captions-only with no crash.
13. `npm run build` succeeds. `npm run lint` clean (or no worse than before your changes — check the baseline first).
14. Lighthouse on the built site: LCP not regressed by more than 100ms versus baseline. Measure baseline before you start.

If any test fails, fix it. Do not push a partially working feature and describe it as done.

---

## 11. Git — commit and push

Only after §10 passes.

```
git status                          # confirm nothing unexpected is staged
git checkout -b feat/voice-guide-agent
```

Commit incrementally, one commit per phase, conventional commit messages:

```
feat(voice-guide): add section registry and scroll tracking
feat(voice-guide): add narration engine with audio and speech-synthesis sources
feat(voice-guide): add amplitude-driven avatar mouth and caption sync
feat(voice-guide): add voice toggle, persistence and reduced-motion support
docs(voice-guide): add discovery notes and recording guide
```

Then:

```
git push -u origin feat/voice-guide-agent
```

If `gh` is available, open a PR against the default branch with a description covering: what was built, the tuning constants and where to change them, the `?vgdebug=1` overlay, what still needs Ashwin's input (the real audio recordings and the script copy), and the §10 results table. If `gh` is not available, print the compare URL from the push output.

**Do not** merge to `main` yourself. **Do not** force-push. **Do not** amend or rebase commits that are already pushed.

If `git push` fails on auth, stop and report the exact error — do not attempt to reconfigure credentials or remotes.

---

## 12. Things not to do

- Don't queue narrations. Ever. See §4.3.
- Don't add a second scroll listener if the repo already has a scroll-spy — reuse it.
- Don't use `scroll` events for the active-section logic; `IntersectionObserver` only.
- Don't replace the existing welcome bubble component wholesale.
- Don't add a heavy dependency (no Three.js, no Rive, no lip-sync ML library) — everything here is Web Audio plus CSS.
- Don't ship the debug overlay enabled by default.
- Don't write the narration copy in a polished marketing voice.
- Don't touch the resume, the nav, or anything unrelated to this feature.

---

## 13. Final report

Output to chat, not a file:

- table of files created and files modified, with a one-line reason each
- the §10 results, pass/fail per test
- the tuning constants you settled on and why
- exact next steps for Ashwin: which audio files to record, in what order, and roughly how long each should be
- anything you had to guess or that you'd flag as a judgement call
