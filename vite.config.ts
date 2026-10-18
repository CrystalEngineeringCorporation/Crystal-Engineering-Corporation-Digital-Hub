import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// BASE_PATH lets the same build run under a sub-path, e.g. GitHub Pages
// serves the site at /<repo-name>/. Local dev and other hosts use "/".
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
})
