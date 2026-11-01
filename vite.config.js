import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Production-only: strip debug noise from the shipped bundle. console.warn
  // and console.error are kept so real failures still surface in DevTools.
  esbuild: mode === 'production'
    ? {
        drop: ['debugger'],
        pure: ['console.log', 'console.debug', 'console.info'],
        legalComments: 'none',
      }
    : undefined,
  build: {
    // Never ship source maps — they would let anyone rebuild the original
    // .jsx files, comments included, straight from the live site.
    sourcemap: false,
    minify: 'esbuild',
    cssMinify: true,
  },
}))
