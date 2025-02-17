/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      colors: {
        // Base colors
        'base-dark': '#0A0F1C',
        'deep-space': '#1A2333',
        'metallic-bronze': '#BD8B4A',
        'neon-cyan': '#00FFE5',
        'ai-magenta': '#FF00C3',
        'futuristic-silver': '#E0E0E0',
        'holographic-teal': '#4DFFEA',
        
        // Semantic colors
        primary: {
          DEFAULT: '#00FFE5',
          dark: '#00D6C0',
          light: '#4DFFEA',
        },
        secondary: {
          DEFAULT: '#FF00C3',
          dark: '#CC009C',
          light: '#FF33CF',
        },
        accent: {
          DEFAULT: '#BD8B4A',
          dark: '#96703B',
          light: '#D4A66C',
        },
        dark: '#171923',       // Darkest blue-gray (cards/modals)
        light: '#EDF2F7',      // Cool gray (primary text)
        muted: '#A0AEC0',      // Cool gray (secondary text)
        highlight: '#4299E1',  // Vivid blue (highlights and hover)
        success: '#48BB78',    // Green (success states)
        warning: '#ED8936',    // Orange (warning states)
        error: '#E53E3E',      // Red (error states)
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-dark-bronze': 'linear-gradient(45deg, #0A0F1C 0%, #1A2333 50%, #BD8B4A 100%)',
        'gradient-cyber': 'radial-gradient(circle, #00FFE5 0%, #FF00C3 100%)',
      },
      boxShadow: {
        'neon-cyan': '0 0 15px #00FFE5',
        'neon-magenta': '0 0 15px #FF00C3',
        'neon-bronze': '0 0 15px #BD8B4A',
      },
      animation: {
        'pulse-cyan': 'pulse-cyan 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-magenta': 'pulse-magenta 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'z-fade': 'z-fade 5s infinite',
        'toolz-expand': 'toolz-expand 5s infinite',
      },
      keyframes: {
        'pulse-cyan': {
          '0%, 100%': { boxShadow: '0 0 15px #00FFE5' },
          '50%': { boxShadow: '0 0 30px #00FFE5' },
        },
        'pulse-magenta': {
          '0%, 100%': { boxShadow: '0 0 15px #FF00C3' },
          '50%': { boxShadow: '0 0 30px #FF00C3' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'z-fade': {
          '0%, 100%': { 
            opacity: '1'
          },
          '20%, 80%': { 
            opacity: '0'
          }
        },
        'toolz-expand': {
          '0%, 100%': { 
            opacity: '0',
            transform: 'scaleX(0)',
            transformOrigin: 'left'
          },
          '20%, 80%': { 
            opacity: '1',
            transform: 'scaleX(1)',
            transformOrigin: 'left'
          }
        }
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
} 