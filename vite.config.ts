import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  // pglite
  optimizeDeps:{
    exclude: ['@electric-sql/pglite'],
  },

  //pglite
  //Additional configuration for the Multi-tab Worker
  worker: {
    format: 'es',
  },
  //
  build: {
    target: "ES2022" // <--------- ✅✅✅✅✅✅
  },
})
