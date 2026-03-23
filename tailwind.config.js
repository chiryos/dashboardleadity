/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#07080f',
        surface: '#0d1121',
        card: '#101627',
        'card-border': '#1a2540',
        accent: '#6366f1',
        'accent-blue': '#3b82f6',
        'accent-purple': '#8b5cf6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(99, 102, 241, 0.15)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.15)',
      },
    },
  },
  plugins: [],
}

