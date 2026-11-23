/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        background: '#FBFBF9',
        surface: '#FFFFFF',
        charcoal: {
          DEFAULT: '#191A1C',
          muted: '#62676D',
          light: '#8E949D',
        },
        botanical: {
          50: '#F2F7F4',
          100: '#E4EFE8',
          200: '#C7DFC7',
          300: '#9FC7AE',
          400: '#6FA886',
          500: '#468963',
          600: '#2F6E4C',
          700: '#23553B',
          800: '#1B4332',
          900: '#133225',
          DEFAULT: '#1B4332',
        },
        sage: {
          50: '#F5F7F6',
          100: '#E8EFEA',
          200: '#D3DFD7',
          300: '#B8CBC0',
          400: '#94B0A0',
          500: '#749682',
          600: '#5C7A68',
          DEFAULT: '#749682',
        },
        border: {
          subtle: '#EAECEE',
          DEFAULT: '#E4E7EC',
          strong: '#D0D5DD',
        }
      },
      transitionTimingFunction: {
        'skill-base': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      spacing: {
        '25': '2px',
        '50': '4px',
        '75': '8px',
        '100': '12px',
        '200': '16px',
        '300': '24px',
        '400': '32px',
        '500': '40px',
        '600': '48px',
        '700': '64px',
        '800': '80px',
        '900': '96px',
      }
    },
  },
  plugins: [],
}
