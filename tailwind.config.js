// @ts-check
const { fontFamily } = require('tailwindcss/defaultTheme');
const { colors: customColors } = require('./data/config/colors');

/** @type {import("tailwindcss").Config } */
module.exports = {
  content: [
    './node_modules/@shipixen/pliny/**/*.js',
    './app/**/*.{js,ts,jsx,tsx,css,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,css,mdx}',
    './components/**/*.{js,ts,jsx,tsx,css,mdx}',
    './layouts/**/*.{js,ts,jsx,tsx,css,mdx}',
    './demo/**/*.{js,ts,jsx,tsx,css,mdx}',
    './data/**/*.mdx',
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      fontFamily: {
        sans: ['var(--font-space-default)', ...fontFamily.sans],
        display: ['var(--font-space-display)', ...fontFamily.sans],
        cursive: ['cursive'],
        // Pixel art fonts
        pixel: ['Courier New', 'Monaco', 'Menlo', 'monospace'],
        mono: ['ui-monospace', 'SF Mono', 'monospace'],
      },
      colors: {
        primary: {
          100: '#f0f0f0',
          200: '#e0e0e0',
          300: '#d0d0d0',
          400: '#a0a0a0',
          500: '#ffffff',
          600: '#e0e0e0',
          700: '#808080',
          800: '#404040',
          900: '#000000',
        },
        // Matrix/Underground dev color system
        'matrix': {
          50: '#f9fafb',
          100: '#f3f4f6', 
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        'terminal': {
          50: '#ffffff',
          100: '#f8f8f8',
          200: '#e8e8e8',
          300: '#d0d0d0',
          400: '#a0a0a0',
          500: '#808080',
          600: '#606060',
          700: '#404040',
          800: '#202020',
          900: '#000000',
        },
        secondary: {
          100: '#e0e0e0',
          200: '#d0d0d0',
          300: '#a0a0a0',
          400: '#808080',
          500: '#606060',
          600: '#404040',
          700: '#303030',
          800: '#202020',
          900: '#101010',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: '#808080',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: `${theme('colors.primary.600')}`,
              },
              code: { color: theme('colors.primary.400') },
            },
            'h1,h2': {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
            },
            h3: {
              fontWeight: '600',
            },
            code: {
              color: theme('colors.indigo.500'),
            },
          },
        },
        invert: {
          css: {
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: `${theme('colors.primary.400')}`,
              },
              code: { color: theme('colors.primary.400') },
            },
            'h1,h2,h3,h4,h5,h6': {
              color: theme('colors.gray.100'),
            },
          },
        },
      }),
      screens: {
        '2xl': '1400px',
        'tall-sm': { raw: '(min-height: 640px)' },
        'tall-md': { raw: '(min-height: 768px)' },
        'tall-lg': { raw: '(min-height: 1024px)' },
        'tall-xl': { raw: '(min-height: 1280px)' },
        'tall-2xl': { raw: '(min-height: 1536px)' },
      },
      zIndex: {
        60: 60,
        70: 70,
        80: 80,
        90: 90,
        100: 100,
        110: 110,
      },
      transitionDuration: {
        2000: '2000ms',
        3000: '3000ms',
        // Pixel art snappy transitions
        50: '50ms',
        75: '75ms',
        100: '100ms',
      },
      // Pixel art spacing system (8px grid)
      spacing: {
        'pixel': '1px',
        'pixel-2': '2px',
        'pixel-4': '4px',
        'pixel-8': '8px',
        'pixel-16': '16px',
      },
      // Pixel art border radius
      borderRadius: {
        'pixel': '1px',
        'pixel-sm': '2px',
        'none': '0px',
      },
      // Hard pixel shadows
      boxShadow: {
        'pixel-sm': '1px 1px 0px rgba(0,0,0,0.5)',
        'pixel': '2px 2px 0px rgba(0,0,0,0.3)',
        'pixel-md': '3px 3px 0px rgba(0,0,0,0.3)', 
        'pixel-lg': '4px 4px 0px rgba(0,0,0,0.3)',
        'pixel-inset': 'inset 2px 2px 0px rgba(255,255,255,0.2)',
        'pixel-pressed': 'inset 1px 1px 0px rgba(0,0,0,0.3)',
      },
      // Pixel font sizes (8px multiples)
      fontSize: {
        'pixel-xs': ['8px', '12px'],
        'pixel-sm': ['12px', '16px'],
        'pixel-base': ['16px', '20px'],
        'pixel-lg': ['20px', '24px'],
        'pixel-xl': ['24px', '28px'],
        'pixel-2xl': ['32px', '36px'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        wiggle: {
          '0%, 100%': {
            transform: 'rotate(-3deg)',
          },
          '50%': {
            transform: 'rotate(3deg)',
          },
        },
        'rotate-left-to-right': {
          '0%': {
            transform: 'rotate(-35deg)',
          },
          '30%': {
            transform: 'rotate(-10deg)',
          },
          '50%': {
            transform: 'rotate(20deg)',
          },
          '60%': {
            transform: 'rotate(35deg)',
          },
          '70%': {
            transform: 'rotate(15deg)',
          },
          '80%': {
            transform: 'rotate(45deg)',
          },
          '90%': {
            transform: 'rotate(-10deg)',
          },
          '100%': {
            transform: 'rotate(-35deg)',
          },
        },
        tilt: {
          '0%,50%,to': {
            transform: 'rotate(0deg)',
          },
          '25%': {
            transform: 'rotate(.5deg)',
          },
          '75%': {
            transform: 'rotate(-.5deg)',
          },
        },
        marquee: {
          '0%': {
            transform: 'translateX(0)',
          },
          '100%': {
            transform: 'translateX(-50%)',
          },
        },
        typewriter: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
      },
      animation: {
        tilt: 'tilt 10s linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        wiggle: 'wiggle 1s ease-in-out infinite',
        'fade-in-down-snail': 'fade-in-down 5s ease-in forwards',
        'fade-in-down-slower': 'fade-in-down 1.2s ease-in-out forwards',
        'fade-in-down-slow': 'fade-in-down 1s ease-in-out forwards',
        'fade-in-down-normal': 'fade-in-down 0.8s ease-in-out forwards',
        'fade-in-down-fast': 'fade-in-down 0.6s ease-in-out forwards',
        'fade-in-down-faster': 'fade-in-down 0.4s ease-in-out forwards',
        'rotate-left-to-right': 'rotate-left-to-right 3s ease-in-out infinite',
        'fade-in-down-normal-delay':
          'fade-in-down 0.8s ease-in-out 2s forwards',
        marquee: '30s marquee linear infinite',
        // Pixel art animations
        'pixel-bounce': 'bounce 0.5s ease-in-out',
        'typewriter': 'typewriter 2s steps(40) forwards',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
