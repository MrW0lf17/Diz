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
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'three-vendor': ['three'],
          'three-extras': ['@react-three/fiber', '@react-three/drei'],
          'chart-vendor': ['chart.js', 'react-chartjs-2', 'lightweight-charts'],
          'utils-vendor': ['axios', 'date-fns', 'uuid', 'clsx'],
          'animation-vendor': ['framer-motion', 'react-spring', 'lottie-react'],
          'tensorflow': ['@tensorflow/tfjs'],
          'ai-apis': ['@huggingface/inference']
        }
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
  }
})
