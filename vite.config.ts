import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React dependencies
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
            return 'react-vendor';
          }
          // Material UI and emotion
          if (id.includes('@mui') || id.includes('@emotion')) {
            return 'mui-vendor';
          }
          // Three.js and related
          if (id.includes('three') && !id.includes('@react-three')) {
            return 'three-vendor';
          }
          if (id.includes('@react-three')) {
            return 'three-extras';
          }
          // Charts
          if (id.includes('chart.js') || id.includes('lightweight-charts')) {
            return 'chart-vendor';
          }
          // Animation libraries
          if (id.includes('framer-motion') || id.includes('react-spring') || id.includes('lottie')) {
            return 'animation-vendor';
          }
          // Utils
          if (id.includes('axios') || id.includes('date-fns') || id.includes('uuid') || id.includes('clsx')) {
            return 'utils-vendor';
          }
          // AI and ML libraries - only chunk if actually imported
          if (id.includes('@tensorflow/tfjs') && id.includes('node_modules')) {
            return 'tensorflow';
          }
          if (id.includes('@huggingface/inference') && id.includes('node_modules')) {
            return 'ai-apis';
          }
        }
      },
      onwarn(warning, warn) {
        // Ignore eval warnings from dependencies
        if (warning.code === 'EVAL' && warning.id?.includes('three-stdlib')) {
          return;
        }
        warn(warning);
      }
    },
    chunkSizeWarningLimit: 1000,
    target: 'esnext',
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  css: {
    postcss: './postcss.config.js',
  },
  optimizeDeps: {
    exclude: ['@tensorflow/tfjs']
  },
  // Environment variable configuration
  envPrefix: 'VITE_'
})
