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
          'mui-core': [
            '@mui/material',
            '@mui/system',
            '@mui/utils',
            '@mui/base',
            '@emotion/react',
            '@emotion/styled',
            '@emotion/cache',
            '@emotion/utils',
            '@emotion/serialize',
            '@emotion/sheet',
            '@emotion/memoize',
            '@emotion/hash',
            '@emotion/unitless',
            '@emotion/is-prop-valid',
            'clsx',
            'prop-types'
          ],
          'mui-icons': ['@mui/icons-material'],
          'three-vendor': ['three'],
          'three-extras': ['@react-three/fiber', '@react-three/drei'],
          'chart-vendor': ['chart.js', 'react-chartjs-2', 'lightweight-charts'],
          'animation-vendor': ['framer-motion', 'react-spring', 'lottie-react'],
          'utils-vendor': ['axios', 'date-fns', 'uuid'],
          'tensorflow': ['@tensorflow/tfjs'],
          'ai-apis': ['@huggingface/inference']
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
    exclude: ['@tensorflow/tfjs'],
    include: [
      '@mui/material',
      '@mui/system',
      '@mui/utils',
      '@mui/base',
      '@emotion/react',
      '@emotion/styled',
      '@emotion/cache',
      '@emotion/utils',
      '@emotion/serialize',
      '@emotion/sheet',
      '@emotion/memoize',
      '@emotion/hash',
      '@emotion/unitless',
      '@emotion/is-prop-valid',
      'clsx',
      'prop-types'
    ],
    esbuildOptions: {
      mainFields: ['module', 'main'],
      resolveExtensions: ['.js', '.jsx', '.ts', '.tsx'],
      loader: {
        '.js': 'jsx'
      }
    }
  },
  resolve: {
    dedupe: ['@mui/material', '@emotion/react', '@emotion/styled']
  },
  // Environment variable configuration
  envPrefix: 'VITE_'
})
