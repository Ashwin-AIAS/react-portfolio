/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Display: tight technical grotesk for headings
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        // Body: unchanged, still Inter
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        // Mono: instrument labels, metric readouts, tech tags
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        // Every value resolves to a token in index.css, so both themes
        // work without per-class !important overrides.
        bg: 'var(--bg)',
        surface: {
          1: 'var(--surface-1)',
          2: 'var(--surface-2)',
          3: 'var(--surface-3)',
        },
        rule: {
          DEFAULT: 'var(--rule)',
          strong: 'var(--rule-strong)',
        },
        ink: {
          DEFAULT: 'var(--text)',
          muted: 'var(--text-muted)',
          dim: 'var(--text-dim)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          strong: 'var(--accent-strong)',
          dim: 'var(--accent-dim)',
          wash: 'var(--accent-wash)',
          line: 'var(--accent-line)',
        },
        ok: {
          DEFAULT: 'var(--ok)',
          wash: 'var(--ok-wash)',
        },
      },
      borderRadius: {
        // Instruments are sharp — the old 20px/980px geometry is gone.
        sm: 'var(--r-sm)',
        DEFAULT: 'var(--r-md)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
      },
      letterSpacing: {
        label: '0.14em',
      },
      // Only motion that survives: a single directional reveal.
      // The old float / glow-pulse / text-shimmer / orbit / gradient-shift
      // loops were unreferenced anywhere in src/ and are removed.
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
