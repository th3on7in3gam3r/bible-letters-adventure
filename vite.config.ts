import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        strategies: 'injectManifest',
        registerType: 'autoUpdate',
        srcDir: 'src',
        filename: 'sw.ts',
        includeAssets: ['favicon.svg', 'favicon-simple.svg'],
        manifest: {
          name: 'Bible Letters Adventure',
          short_name: 'BibleLetters',
          description: 'Joyful Christian word adventures for kids.',
          theme_color: '#2563eb',
          background_color: '#fdfbf2',
          display: 'standalone',
          start_url: '/',
          icons: [
            {
              src: '/favicon-simple.svg',
              sizes: '192x192',
              type: 'image/svg+xml',
            },
            {
              src: '/favicon.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
            },
          ],
        },
        injectManifest: {
          minify: false,
        },
      }),
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
