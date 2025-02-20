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
        target: 'https://bck.railway.internal',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui-core': [
            '@mui/material',
            '@mui/system',
            '@emotion/react',
            '@emotion/styled',
            '@emotion/cache'
          ],
          'mui-icons': ['@mui/icons-material'],
          'three-vendor': ['three'],
          'three-extras': ['@react-three/fiber', '@react-three/drei'],
          'chart-vendor': ['chart.js', 'react-chartjs-2', 'lightweight-charts'],
          'animation-vendor': ['framer-motion', 'react-spring', 'lottie-react'],
          'utils-vendor': ['axios', 'date-fns', 'uuid'],
          'tensorflow': ['@tensorflow/tfjs'],
          'ai-apis': ['@huggingface/inference'],
          'bg-removal': ['@imgly/background-removal']
        }
      },
      onwarn(warning, warn) {
        // Ignore eval warnings from dependencies
        if (warning.code === 'EVAL' && warning.id?.includes('three-stdlib')) {
          return;
        }
        // Ignore external module warnings for @imgly/background-removal
        if (warning.code === 'UNRESOLVED_IMPORT' && warning.source === '@imgly/background-removal') {
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
    exclude: ['@tensorflow/tfjs'],
    include: [
      '@mui/material',
      '@mui/system',
      '@emotion/react',
      '@emotion/styled',
      '@emotion/cache',
      '@imgly/background-removal'
    ]
  },
  resolve: {
    dedupe: ['@mui/material', '@emotion/react', '@emotion/styled']
  },
  // Environment variable configuration
  envPrefix: 'VITE_'
})
