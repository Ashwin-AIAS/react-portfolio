# Voice Guide — Phase 0 Discovery

Written before any code changes, per spec §2. Everything here was read out of the repo,
not assumed.

## 1. Stack

| Thing        | Value                                                                     |
| ------------ | ------------------------------------------------------------------------- |
| Build tool   | **Vite 5.4.20** (`vite.config.js`, `"type": "module"`)                     |
| Framework    | **React 18.2** (`react`, `react-dom` ^18.2.0), `StrictMode` on             |
| Language     | **JavaScript / JSX — no TypeScript.** No `tsconfig.json` anywhere.         |
| Styling      | **Tailwind 3.4** + two hand-written stylesheets: `src/index.css`, `src/App.css`. Heavy use of inline `style={{}}` objects in components. |
| Animation    | **framer-motion 12.35** — used pervasively (`motion.*`, `AnimatePresence`) |
| Other deps   | `@google/genai` (AI assistant section)                                     |
| Entry        | `src/main.jsx` → `src/App.jsx`                                             |

> **Consequence for this feature:** the spec's file layout (§3.1) names `.ts` / `.tsx`
> files. This repo has no TypeScript toolchain — adding `.ts` would need a `tsconfig`,
> and `eslint`/`npm run lint` are scoped to `js,jsx`. **All voice-guide modules are
> written as `.js` / `.jsx`** with the spec's interfaces preserved as JSDoc typedefs.
> This is the easily-reversible choice: renaming to `.ts` later is mechanical.

## 2. The avatar

- **File:** `src/components/ui/AvatarGuide.jsx` (the only avatar; rendered from
  `src/App.jsx:349` as `{splashDone && <AvatarGuide />}`).
- **What it renders:** a plain **`<motion.img src="/avatar-emoji.png">`**, 130×130 px,
  `objectFit: contain`. **A single static PNG — no sprite sheet, no canvas, no Lottie.**
  → §6.1 "single static image" branch applies: overlay an SVG mouth.
- `display: none` on mobile (`window.innerWidth < 768`) — the image is hidden but the
  bubble still shows, repositioned `position: fixed` at the bottom of the screen.
- A **second, separate** avatar image exists in the splash screen
  (`src/App.jsx:192`, same `/avatar-emoji.png`). That one is not the guide and is
  **out of scope** — it unmounts after ~2.5 s.
- Assets present: `public/avatar-emoji.png`, plus an unused `public/avatar-emoji (1).png`.

## 3. The existing welcome bubble

All inside `AvatarGuide.jsx`:

- `tourSteps` array (lines 5–13) holds `{ section, emotion, message, x, y }`.
  First message is exactly:
  `"👋 Hey! I'm Ashwin — welcome! Let me show you around."`
- **Bubble** — `motion.div` keyed on `currentStep`, `AnimatePresence mode="wait"`,
  white rounded card, `<p>{tourSteps[currentStep].message}</p>`.
- **Dot pagination** — line 159: maps `tourSteps` to 6×6 px dots, active dot
  `#2563eb`, inactive `#cbd5e1`.
- **`×` dismiss** — line 163: `onClick={() => setTourActive(false)}`. Sets local state
  only; the bubble disappears and the avatar becomes a click-to-restart target.
- Footer line: `"scroll to explore ↓"`.
- Gating: `sessionStorage.getItem('toured')` — the tour only auto-runs once per session.

**Note (pre-existing, not touched):** `tourSteps` order is
`hero, roadmap, skills, projects, assistant, certifications, contact` — which does **not**
match document order (`assistant` is 2nd in the DOM, 5th in this array), and it omits
`github` entirely. The dot pagination therefore already jumps around. Left exactly as-is
per §1.1/§12.

## 4. Top-level sections, in document order

From `src/App.jsx:330–344`. Verified live in the DOM (8 × `section[id]`).

| # | id               | Component                  | Wrapper                        | Stable `id`? |
| - | ---------------- | -------------------------- | ------------------------------ | ------------ |
| 0 | `hero`           | `Hero.jsx:63`              | bare `<section id="hero">`     | yes          |
| 1 | `assistant`      | `AIAssistantSection.jsx:604` | `<Section id="assistant">`   | yes          |
| 2 | `roadmap`        | `CareerRoadmapSection.jsx:146` | `<Section id="roadmap">`   | yes          |
| 3 | `skills`         | `SkillsSection.jsx:145`    | `<Section id="skills">`        | yes          |
| 4 | `github`         | `GitHubSection.jsx:94`     | `<Section id="github">`        | yes          |
| 5 | `projects`       | `ProjectsSection.jsx:91`   | `<Section id="projects">`      | yes          |
| 6 | `certifications` | `CertificationsSection.jsx:9` | `<Section id="certifications">` | yes       |
| 7 | `contact`        | `ContactSection.jsx:33`    | `<Section id="contact">`       | yes          |

- Seven of the eight go through the shared wrapper `src/components/ui/Section.jsx`,
  which renders `<section id={id} className="py-32 md:py-44 px-6">`. **`hero` is the
  exception** — it writes its own `<section>`.
- All ids are already used by the header nav (`Header.jsx:14`) and by
  `useActiveSection`. **None will be renamed.**
- `data-narrate` is added by passing it through `Section.jsx` (one prop spread) and by
  one attribute on the `hero` section — the two smallest possible insertions.

## 5. Existing scroll / observer machinery — reuse, don't compete

| Where | Mechanism | Purpose |
| ----- | --------- | ------- |
| `src/hooks/useActiveSection.js` | `IntersectionObserver`, `rootMargin: '-30% 0px -70% 0px'`, observes `section[id]` | drives the **header nav** highlight |
| `src/components/ui/AvatarGuide.jsx:78` | `window.addEventListener('scroll')` + `offsetTop` math | drives the **existing tour step** |
| `src/components/ui/Header.jsx:18` | `scroll` listener | `isScrolled` boolean for the header background |
| `src/components/ui/ScrollToTop.jsx:8` | `scroll` listener | show/hide the back-to-top button |
| `src/components/ui/LidarSweep.jsx:126` | `IntersectionObserver` | pause the hero canvas when off-screen |
| `src/components/ui/AnimateOnScroll.jsx` | `IntersectionObserver` | per-element reveal |

**Decision.** The app-level `useActiveSection` is tuned for nav highlighting
(`-30%/-70%` is a thin band) and returns a bare string with no ratio map, no velocity,
and no commit/settle logic — it cannot express §4.2–§4.3. The voice guide gets its
**own** observer under `src/voice-guide/`, observing `[data-narrate]` rather than
`section[id]`, and the existing hook is left byte-identical so the nav keeps behaving
exactly as it does now. This is one additional `IntersectionObserver`, which is cheap;
it is **not** an additional `scroll` listener — §4.1 sampling uses a single shared rAF
loop (§12: "don't use scroll events for the active-section logic").

## 6. Audio assets

- `public/` contains: `Ashwin_Vignesh_M_Resume.pdf`, `avatar-emoji.png`,
  `avatar-emoji (1).png`, `profile.jpg`, `vite.svg`, `job-alert-dashboard.jsx`.
- **No audio of any kind.** No `public/audio/`. Confirms the §5.1 ordering: build
  `SpeechSynthesisSource` first so the feature is testable today with zero assets.

## 7. Pre-existing Web Audio / speech code

- `src/hooks/useGeminiLive.js:99,165` — creates its own `AudioContext` for the Gemini
  Live mic/playback feature used by `AIAssistantSection`.
  **Risk:** two `AudioContext`s can coexist, but both playing at once = two voices.
  Handled by the voice guide stopping narration when the Gemini agent starts (see
  implementation note in `narrationEngine`).
- `src/hooks/useSpeechInput.js` — `SpeechRecognition` (input, not output). No conflict.
- `src/components/ui/GeminiVoiceAgent.jsx` — **dead file, imported nowhere.** Left alone.
- No existing `speechSynthesis` usage anywhere. The voice guide is the first consumer.

## 8. Tooling / git

| Check | Result |
| ----- | ------ |
| `git remote -v` | `origin https://github.com/Ashwin-AIAS/react-portfolio.git` (fetch + push) |
| `gh` CLI | **available**, `gh version 2.96.0` |
| Default branch | `main` |
| `.gitignore` covers | `.env`, `.env.*`, `node_modules`, `dist`, `*.log` — all good, §1.7 satisfied |
| Untracked junk at root | `build.log`, `build_error.txt`, `build_error2.txt`, `dump_errors.js`, `walkthrough/` — pre-existing, **not** staged by this work |

`.env` exists at the repo root and **is** gitignored. Verified before the first commit.

## 9. Baselines captured before any edit

### `npm run build` — passes

```
476 modules transformed
dist/assets/index-CyHxJRbP.js   394.59 kB │ gzip: 123.76 kB
dist/assets/index-bm7Y0wqG.css   65.80 kB │ gzip:  12.41 kB
✓ built in 6.22s
```

### `npm run lint` — **already broken before this work**

```
Invalid option '--ext' - perhaps you meant '-c'?
You're using eslint.config.js, some command line flags are no longer available.
```

and running the binary directly:

```
$ npx eslint .
ESLint: 8.57.1
Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './config' is not defined
by "exports" in .../node_modules/eslint/package.json
imported from .../eslint.config.js
exit code 2
```

**Cause:** `eslint.config.js` is written against **ESLint 9** (`defineConfig`,
`globalIgnores` from `eslint/config`) but `eslint@8.57.1` is what's installed, and the
`lint` script still passes the ESLint-8-only `--ext` flag. The two are mutually
incompatible, so lint cannot run at all — **independent of this feature**.

Per §12 ("don't touch anything unrelated") this is **not fixed here**. §10.13's bar is
"no worse than before"; the baseline is a hard failure, so the voice-guide code is
instead lint-checked with an equivalent throwaway flat config to prove it introduces no
new violations. Flagged for Ashwin in the final report.

### Lighthouse — **LCP is not measurable on this site**

`lighthouse@11` and `@12`, 3 runs each, headless Chrome:

```
largest-contentful-paint: scoreDisplayMode = "error"
errorMessage: "The page did not display content that qualifies as a Largest
Contentful Paint (LCP). ... (NO_LCP)"
```

Confirmed independently via CDP with a `PerformanceObserver`
(`type: 'largest-contentful-paint', buffered: true`) — **zero LCP entries** across 5
runs, page `visibilityState: "visible"`, content fully rendered, hero `<img>` present.

**Cause:** Chrome excludes an element from LCP candidacy if it is fully transparent at
its first paint, and *never* re-admits it when it later animates in. On this site
essentially every element — splash, hero, and every `AnimateOnScroll` /
`StaggeredReveal` child — mounts at `opacity: 0` under framer-motion. The page therefore
has **no LCP candidate at all**. This is a pre-existing, site-wide property and has
nothing to do with the voice guide.

**Substitute for §10.14.** Since LCP is absent both before and after, it cannot regress.
The comparison is instead run on the paint metrics that *do* report, measured
identically before and after:

| Metric | Baseline (median) | How |
| ------ | ----------------- | --- |
| FCP (Lighthouse, throttled) | **1808 ms** | `lighthouse@11`, n=3, `--only-categories=performance` |
| Speed Index | **1933 ms** | same |
| TBT | **164 ms** | same |
| CLS | **0.042** | same |
| LCP | **NO_LCP** | same |
| FCP (CDP, unthrottled localhost) | **220 ms** | `PerformanceObserver`, n=5 |
| Main JS bundle | **394.59 kB / 123.76 kB gzip** | `vite build` |

Raw JSON kept out of the repo (scratchpad only).

## 10. Localisation note

`src/hooks/useLang.js` + `src/data/translations.js` provide `en` / `de` with a `t`
object threaded into every section. **The narration script added here is English-only**
placeholder copy. Wiring narration into `translations.js` would mean editing existing
copy files, which §1.2 forbids. Flagged as a judgement call in the final report.
