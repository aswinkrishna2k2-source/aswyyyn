import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Libraries go in their own chunks: they rarely change, so after a deploy returning visitors keep
// them cached and only download the app's own code again
const VENDOR_CHUNKS: [RegExp, string][] = [
  [/[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/, 'react'],
  [/[\\/]node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/, 'motion'],
  [/[\\/]node_modules[\\/](gsap|lenis)[\\/]/, 'scroll'],
]

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => VENDOR_CHUNKS.find(([pattern]) => pattern.test(id))?.[1],
      },
    },
  },
})
