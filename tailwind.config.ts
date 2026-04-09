import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // CyberSalama brand palette
        salama: {
          50:  '#edfcf4',
          100: '#d2f9e6',
          200: '#a9f0cf',
          300: '#72e3b2',
          400: '#38ce8e',
          500: '#14b374',   // primary green
          600: '#0a9060',
          700: '#09724e',
          800: '#0a5b3f',
          900: '#094b35',
          950: '#042a1e',
        },
        radar: {
          50:  '#fef2f2',
          100: '#fee2e2',
          300: '#fca5a5',
          500: '#ef4444',   // threat red
          700: '#b91c1c',
          900: '#7f1d1d',
        },
        cyber: {
          50:  '#f0fdfb',
          100: '#ccfbf1',
          400: '#2dd4bf',
          500: '#14b8a6',   // teal accent
          600: '#0d9488',
          900: '#134e4a',
        },
        ink: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      },
      fontFamily: {
        display: ['var(--font-sora)', 'sans-serif'],
        body:    ['var(--font-dm-sans)', 'sans-serif'],
        mono:    ['var(--font-jetbrains)', 'monospace'],
      },
      animation: {
        'pulse-slow':   'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':        'float 6s ease-in-out infinite',
        'scan':         'scan 2s linear infinite',
        'glow':         'glow 2s ease-in-out infinite alternate',
        'slide-up':     'slideUp 0.5s ease-out forwards',
        'fade-in':      'fadeIn 0.4s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        glow: {
          '0%':   { boxShadow: '0 0 5px #14b374, 0 0 10px #14b374' },
          '100%': { boxShadow: '0 0 20px #14b374, 0 0 40px #14b37440' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2314b374' fill-opacity='0.04'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        'dot-pattern':  "radial-gradient(circle, #14b37420 1px, transparent 1px)",
        'cyber-grid':   "linear-gradient(rgba(20,179,116,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(20,179,116,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        'dot-sm': '20px 20px',
        'dot-md': '32px 32px',
        'grid-sm': '20px 20px',
      },
    },
  },
  plugins: [],
}

export default config
