import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        
        assetFileNames: `assets-versus/[name]-[hash][extname]`,
        
        chunkFileNames: 'assets-versus/[name]-[hash].js',
        
        entryFileNames: 'assets-versus/[name]-[hash].js',
      },
    },
  },
})
