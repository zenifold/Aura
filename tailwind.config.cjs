/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aura: {
          50: '#f3f1ff',
          100: '#ebe5ff',
          200: '#d9ceff',
          300: '#bea6ff',
          400: '#9f75ff',
          500: '#843dff',
          600: '#7916ff',
          700: '#6b04fd',
          800: '#5a03d5',
          900: '#4b02ad',
        },
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#b9e6fe',
          300: '#7cd4fd',
          400: '#36bffa',
          500: '#0ba5ec',
          600: '#0086c9',
          700: '#026aa2',
          800: '#065986',
          900: '#0b4a6f',
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        status: {
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
        },
        dark: {
          bg: '#1a1b1e',
          card: '#25262b',
          hover: '#2c2e33',
          border: '#373A40',
          text: '#C1C2C5',
        }
      },
      boxShadow: {
        'aura': '0 0 15px -3px rgba(132, 61, 255, 0.1), 0 0 6px -4px rgba(132, 61, 255, 0.1)',
        'aura-md': '0 4px 6px -1px rgba(132, 61, 255, 0.1), 0 2px 4px -2px rgba(132, 61, 255, 0.1)',
        'aura-lg': '0 10px 15px -3px rgba(132, 61, 255, 0.1), 0 4px 6px -4px rgba(132, 61, 255, 0.1)',
      },
    },
  },
  plugins: [],
}
