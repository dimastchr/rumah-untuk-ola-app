import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Web statis: tanpa API, tanpa kunci. Build untuk GitHub Pages: `npx vite build --base=./`
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
