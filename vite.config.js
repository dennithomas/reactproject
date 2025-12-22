import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/reactproject/', // ✅ matches your GitHub repo
  plugins: [react()],
});

