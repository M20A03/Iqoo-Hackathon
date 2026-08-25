/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B301B', // Forest Green
          light: '#16442C',
          dark: '#051A0B',
        },
        secondary: {
          DEFAULT: '#FFB800', // Warm Gold
          hover: '#E5A500',
        },
        accent: {
          DEFAULT: '#2CA470', // Teal
          soft: 'rgba(44, 164, 112, 0.05)',
        },
        background: '#F8F9FA', // Light Grey Background
        surface: {
          DEFAULT: '#FFFFFF', // Pure White Surface
          light: '#F1F3F5',
          border: '#E9ECEF',
        },
        text: {
          primary: '#1A1A1A', // Deep Charcoal
          secondary: '#4A4A4A', // Muted Grey
          muted: '#868E96',
        },
        error: '#D94111',
        success: '#28A745',
      },
      fontFamily: {
        sans: ['Lexend', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        display: ['Playfair Display', 'serif'],
        body: ['Lexend', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'soft': '0 10px 30px -5px rgba(0, 0, 0, 0.04), 0 4px 15px -3px rgba(0, 0, 0, 0.02)',
        'card': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
