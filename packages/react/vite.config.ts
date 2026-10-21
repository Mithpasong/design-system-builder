import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { generateScopedName } from './css-scope';

/**
 * Library build: dist/index.js (ESM, React external) + dist/components.css.
 * The docs site embeds these files in the npm package export.
 */
export default defineConfig({
  plugins: [react()],
  css: {
    modules: { generateScopedName },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'index.js',
      cssFileName: 'components',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/server'],
      // Components use hooks; mark the bundle as client code for React Server Components (Next.js app router)
      output: { banner: "'use client';" },
    },
    minify: false,
    sourcemap: false,
  },
});
