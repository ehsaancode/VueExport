import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './', // ✅ ensures all asset paths are relative (important for iframe embedding)
  plugins: [react(),tailwindcss(),],
});
