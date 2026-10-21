import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { generateScopedName } from '../../packages/react/css-scope';

export default defineConfig({
  plugins: [react()],
  css: {
    modules: { generateScopedName },
  },
});
