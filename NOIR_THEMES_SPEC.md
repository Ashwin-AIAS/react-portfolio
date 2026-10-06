# NOIR THEMES — IMPLEMENTATION SPEC (for Claude Code)

**Project:** `react-portfolio` · **Branch:** `main` · **Status:** Ready to implement

## 0. Why
All 9 existing palettes are dark, but every one tints its `--bg`/`--surface-*`/`--rule`
toward its accent (navy, green, purple…), so none reads as **black**. This adds 5 palettes
built on **true black / neutral charcoal** with untinted gray surfaces.

| Order | id | Name | Label | Swatch | Dark bg | Dark accent |
|---|---|---|---|---|---|---|
| 1 | `obsidian` | Obsidian Mono | Pure Monochrome | `#ffffff` | `#000000` | `#ffffff` |
| 2 | `titanium` | Carbon Titanium | Brushed Steel | `#a8b3c4` | `#0a0a0b` | `#a8b3c4` |
| 3 | `onyx` | Onyx & Gold | Champagne Luxe | `#d4af37` | `#0a0908` | `#d4af37` |
| 4 | `venom` | Venom Acid | Symbiote Lime | `#c6ff00` | `#000000` | `#c6ff00` |
| 5 | `ember` | Molten Ember | Forge Orange | `#ff4d00` | `#000000` | `#ff4d00` |

## 1. Rules (read before coding)
1. **Do not change any existing palette.** Only add.
2. Every new palette touches exactly **3 places**:
   - `src/index.css` — add `.palette-<id>` and `.theme-light.palette-<id>` blocks **after**
     `.theme-light.palette-cyberpunk { … }` and **before** `/* ===== BASE ===== */`.
   - `src/components/ui/ThemePaletteSelector.jsx` — append an entry to `THEMES`
     (same shape as existing: `id, name, label, color, dotClass`, plus `group: 'noir'`).
   - `src/App.jsx` — append `'palette-<id>'` to the `allPalettes` array in the palette `useEffect`.
3. **Specificity gotcha:** `.palette-<id>` (0,1,0) is declared after `.theme-light` (0,1,0), so
   any token set in the dark block **leaks into light mode** unless the light block re-declares it.
   The light block must define **every token** the dark block defines. The blocks below already do.
4. Do **not** set `--ok`, `--err`, `--r-*`, or fonts — they inherit from `:root`.
5. Do **not** refactor `allPalettes` to import `THEMES` (App ⇄ Selector would become a circular import).
6. Conventional commit style matching repo history (`feat(scope): …`). One commit per theme.

## 2. Per-theme steps (repeat for each of the 5, in order)
1. Paste the CSS blocks for that theme (Section 4) into `index.css`.
2. Append the `THEMES` entry (Section 3).
3. Append `'palette-<id>'` to `allPalettes` in `App.jsx`.
4. Run `npm run build` — must succeed with no new warnings.
5. Commit **only those 3 files**:
   ```
   git add src/index.css src/components/ui/ThemePaletteSelector.jsx src/App.jsx
   git commit -m "<message from Section 5>"
   ```

## 3. `THEMES` entries (append to the end of the array, in this order)
```js
{ id: 'obsidian', name: 'Obsidian Mono',   label: 'Pure Monochrome', color: '#ffffff', dotClass: 'bg-[#ffffff]', group: 'noir' },
{ id: 'titanium', name: 'Carbon Titanium', label: 'Brushed Steel',   color: '#a8b3c4', dotClass: 'bg-[#a8b3c4]', group: 'noir' },
{ id: 'onyx',     name: 'Onyx & Gold',     label: 'Champagne Luxe',  color: '#d4af37', dotClass: 'bg-[#d4af37]', group: 'noir' },
{ id: 'venom',    name: 'Venom Acid',      label: 'Symbiote Lime',   color: '#c6ff00', dotClass: 'bg-[#c6ff00]', group: 'noir' },
{ id: 'ember',    name: 'Molten Ember',    label: 'Forge Orange',    color: '#ff4d00', dotClass: 'bg-[#ff4d00]', group: 'noir' },
```
(Format to match the multi-line style of the existing entries.)

## 4. CSS blocks

### 4.1 `obsidian` — Obsidian Mono
```css
/* ===================================================================
   NOIR COLLECTION — true-black palettes with neutral (untinted) surfaces
   =================================================================== */

/* Obsidian — Pure Monochrome */
.palette-obsidian {
  --bg: #000000;
  --surface-1: #0a0a0a;
  --surface-2: #111111;
  --surface-3: #1a1a1a;
  --rule: #232323;
  --rule-strong: #343434;
  --text: #fafafa;
  --text-muted: #a3a3a3;
  --text-dim: #6e6e6e;
  --accent: #ffffff;
  --on-accent: #000000;
  --accent-strong: #e5e5e5;
  --accent-dim: #a3a3a3;
  --accent-wash: rgba(255, 255, 255, 0.07);
  --accent-line: rgba(255, 255, 255, 0.28);
  --heat-0: #111111;
  --heat-1: rgba(255, 255, 255, 0.18);
  --heat-2: rgba(255, 255, 255, 0.38);
  --heat-3: rgba(255, 255, 255, 0.62);
  --heat-4: #ffffff;
}
.theme-light.palette-obsidian {
  --bg: #fafafa;
  --surface-1: #ffffff;
  --surface-2: #f2f2f2;
  --surface-3: #e8e8e8;
  --rule: #dcdcdc;
  --rule-strong: #bdbdbd;
  --text: #0a0a0a;
  --text-muted: #525252;
  --text-dim: #737373;
  --accent: #000000;
  --on-accent: #ffffff;
  --accent-strong: #262626;
  --accent-dim: #525252;
  --accent-wash: rgba(0, 0, 0, 0.05);
  --accent-line: rgba(0, 0, 0, 0.25);
  --heat-0: #e8e8e8;
  --heat-1: rgba(0, 0, 0, 0.18);
  --heat-2: rgba(0, 0, 0, 0.38);
  --heat-3: rgba(0, 0, 0, 0.62);
  --heat-4: #000000;
}
```

### 4.2 `titanium` — Carbon Titanium
```css
/* Titanium — Carbon / Brushed Steel */
.palette-titanium {
  --bg: #0a0a0b;
  --surface-1: #0f0f11;
  --surface-2: #151518;
  --surface-3: #1c1c20;
  --rule: #26262b;
  --rule-strong: #38383f;
  --text: #f4f5f7;
  --text-muted: #a1a1aa;
  --text-dim: #6b6b73;
  --accent: #a8b3c4;
  --on-accent: #0a0a0b;
  --accent-strong: #cbd5e1;
  --accent-dim: #64748b;
  --accent-wash: rgba(168, 179, 196, 0.1);
  --accent-line: rgba(168, 179, 196, 0.35);
  --heat-0: #151518;
  --heat-1: rgba(168, 179, 196, 0.22);
  --heat-2: rgba(168, 179, 196, 0.45);
  --heat-3: rgba(168, 179, 196, 0.7);
  --heat-4: #a8b3c4;
}
.theme-light.palette-titanium {
  --bg: #f5f5f7;
  --surface-1: #ffffff;
  --surface-2: #ececef;
  --surface-3: #e2e2e6;
  --rule: #d4d4d8;
  --rule-strong: #a1a1aa;
  --text: #111113;
  --text-muted: #4b4b52;
  --text-dim: #6b6b73;
  --accent: #475569;
  --on-accent: #ffffff;
  --accent-strong: #334155;
  --accent-dim: #94a3b8;
  --accent-wash: rgba(71, 85, 105, 0.08);
  --accent-line: rgba(71, 85, 105, 0.3);
  --heat-0: #e2e2e6;
  --heat-1: rgba(71, 85, 105, 0.22);
  --heat-2: rgba(71, 85, 105, 0.45);
  --heat-3: rgba(71, 85, 105, 0.7);
  --heat-4: #475569;
}
```

### 4.3 `onyx` — Onyx & Gold
```css
/* Onyx — Champagne Gold on Warm Black */
.palette-onyx {
  --bg: #0a0908;
  --surface-1: #100f0d;
  --surface-2: #171513;
  --surface-3: #1f1c19;
  --rule: #2a2622;
  --rule-strong: #3d3731;
  --text: #f7f3ea;
  --text-muted: #b0a898;
  --text-dim: #756e62;
  --accent: #d4af37;
  --on-accent: #0a0908;
  --accent-strong: #e6c65c;
  --accent-dim: #9c7f22;
  --accent-wash: rgba(212, 175, 55, 0.1);
  --accent-line: rgba(212, 175, 55, 0.35);
  --heat-0: #171513;
  --heat-1: rgba(212, 175, 55, 0.22);
  --heat-2: rgba(212, 175, 55, 0.45);
  --heat-3: rgba(212, 175, 55, 0.7);
  --heat-4: #d4af37;
}
.theme-light.palette-onyx {
  --bg: #faf8f3;
  --surface-1: #ffffff;
  --surface-2: #f3efe6;
  --surface-3: #e9e3d6;
  --rule: #ddd5c4;
  --rule-strong: #bfb39b;
  --text: #14110c;
  --text-muted: #57503f;
  --text-dim: #786f5d;
  --accent: #8a6d10;
  --on-accent: #ffffff;
  --accent-strong: #6e5609;
  --accent-dim: #c9a227;
  --accent-wash: rgba(138, 109, 16, 0.08);
  --accent-line: rgba(138, 109, 16, 0.3);
  --heat-0: #e9e3d6;
  --heat-1: rgba(138, 109, 16, 0.22);
  --heat-2: rgba(138, 109, 16, 0.45);
  --heat-3: rgba(138, 109, 16, 0.7);
  --heat-4: #8a6d10;
}
```

### 4.4 `venom` — Venom Acid
```css
/* Venom — Symbiote Acid Lime */
.palette-venom {
  --bg: #000000;
  --surface-1: #080808;
  --surface-2: #0f0f0f;
  --surface-3: #171717;
  --rule: #212121;
  --rule-strong: #323232;
  --text: #f5f5f5;
  --text-muted: #a3a3a3;
  --text-dim: #6b6b6b;
  --accent: #c6ff00;
  --on-accent: #000000;
  --accent-strong: #d9ff4d;
  --accent-dim: #84a800;
  --accent-wash: rgba(198, 255, 0, 0.1);
  --accent-line: rgba(198, 255, 0, 0.35);
  --heat-0: #0f0f0f;
  --heat-1: rgba(198, 255, 0, 0.22);
  --heat-2: rgba(198, 255, 0, 0.45);
  --heat-3: rgba(198, 255, 0, 0.7);
  --heat-4: #c6ff00;
}
.theme-light.palette-venom {
  --bg: #f7f7f5;
  --surface-1: #ffffff;
  --surface-2: #efefec;
  --surface-3: #e4e4e0;
  --rule: #d6d6d1;
  --rule-strong: #b0b0a8;
  --text: #0a0a0a;
  --text-muted: #4f4f4a;
  --text-dim: #6f6f69;
  --accent: #4d7c0f;
  --on-accent: #ffffff;
  --accent-strong: #3f6212;
  --accent-dim: #84cc16;
  --accent-wash: rgba(77, 124, 15, 0.08);
  --accent-line: rgba(77, 124, 15, 0.3);
  --heat-0: #e4e4e0;
  --heat-1: rgba(77, 124, 15, 0.22);
  --heat-2: rgba(77, 124, 15, 0.45);
  --heat-3: rgba(77, 124, 15, 0.7);
  --heat-4: #4d7c0f;
}
```

### 4.5 `ember` — Molten Ember
```css
/* Ember — Molten Forge Orange */
.palette-ember {
  --bg: #000000;
  --surface-1: #0a0908;
  --surface-2: #12100e;
  --surface-3: #1a1714;
  --rule: #26211d;
  --rule-strong: #3a322b;
  --text: #faf5f2;
  --text-muted: #b0a49c;
  --text-dim: #756961;
  --accent: #ff4d00;
  --on-accent: #000000;
  --accent-strong: #ff7a3d;
  --accent-dim: #c23a00;
  --accent-wash: rgba(255, 77, 0, 0.12);
  --accent-line: rgba(255, 77, 0, 0.4);
  --heat-0: #12100e;
  --heat-1: rgba(255, 77, 0, 0.22);
  --heat-2: rgba(255, 77, 0, 0.45);
  --heat-3: rgba(255, 77, 0, 0.7);
  --heat-4: #ff4d00;
}
.theme-light.palette-ember {
  --bg: #faf7f5;
  --surface-1: #ffffff;
  --surface-2: #f4eeea;
  --surface-3: #ebe2dc;
  --rule: #ddd0c7;
  --rule-strong: #c0ad9f;
  --text: #170c06;
  --text-muted: #5c4a3f;
  --text-dim: #7d6a5e;
  --accent: #c2410c;
  --on-accent: #ffffff;
  --accent-strong: #9a3412;
  --accent-dim: #f97316;
  --accent-wash: rgba(194, 65, 12, 0.08);
  --accent-line: rgba(194, 65, 12, 0.3);
  --heat-0: #ebe2dc;
  --heat-1: rgba(194, 65, 12, 0.22);
  --heat-2: rgba(194, 65, 12, 0.45);
  --heat-3: rgba(194, 65, 12, 0.7);
  --heat-4: #c2410c;
}
```

## 5. Commit messages (one per theme, in order)
1. `feat(theme): add Obsidian Mono true-black monochrome palette`
2. `feat(theme): add Carbon Titanium brushed-steel palette`
3. `feat(theme): add Onyx & Gold champagne palette`
4. `feat(theme): add Venom Acid symbiote-lime palette`
5. `feat(theme): add Molten Ember forge-orange palette`

## 6. Final commit — selector polish (Noir group + visible white swatch)
In `ThemePaletteSelector.jsx`:
1. **Noir section heading:** while mapping `THEMES`, when the current theme has `group === 'noir'`
   and the previous one does not, render a non-interactive divider before it:
   ```jsx
   <div className="px-2.5 pt-2 pb-1 mt-1 border-t border-rule font-mono text-[10px] uppercase tracking-label text-ink-dim">
       Noir
   </div>
   ```
   Use a `React.Fragment` with `key={theme.id}` so keys stay unique.
2. **White swatch visibility:** Obsidian's `#ffffff` dot disappears on light surfaces. Add a
   hairline ring to **both** swatch `<span>`s (trigger button + list item):
   `outline: '1px solid var(--rule-strong)', outlineOffset: '1px'` in their `style` objects.
   Keep the existing glow `boxShadow` untouched.
3. `npm run build`, then commit:
   ```
   git add src/components/ui/ThemePaletteSelector.jsx NOIR_THEMES_SPEC.md
   git commit -m "feat(theme): group noir palettes in selector and outline swatches"
   ```

## 7. Verification (before pushing)
- `npm run dev`, open the site, and for **each** of the 5 themes check **dark and light** mode:
  - Background is visibly black/neutral (dark) — no color cast on panels or borders.
  - Primary buttons: text uses `--on-accent` and is readable (Obsidian = black on white, Ember = black on orange).
  - GitHub heatmap, LiDAR/canvas elements, and AmbientBackdrop pick up the new accent.
  - Selector shows "Noir" heading, count reads **14 Themes**, Obsidian dot is visible in light mode.
- Reload the page — the selected palette persists (`localStorage['theme-palette']`).
- Switch back to an old palette (e.g. `cyan`) — no leftover `palette-*` class on `<html>`.
- `git log --oneline -n 6` shows exactly the 6 new commits.

## 8. Final push
```
git push origin main
```
Report back: the 6 commit hashes + messages, build result, and any visual issues found.
