import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Конфігурація Vite для React + TypeScript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // порт за замовчуванням (можеш змінити)
    open: `chome`, // автоматично відкриває браузер
  },
  build: {
    outDir: 'dist', // папка для збірки
  },
})
