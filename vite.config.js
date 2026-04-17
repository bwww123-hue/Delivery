import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',   // GitHub Pages 경로 문제 해결 (상대 경로)
})
