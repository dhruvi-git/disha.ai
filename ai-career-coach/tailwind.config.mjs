/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
        colors: {
            // "Disha AI" Dark/Neon Palette Overrides
            background: '#030014', // Deep purple/black
            foreground: '#ffffff',
            card: {
                DEFAULT: '#120b2e', // Dark purple card bg
                foreground: '#ffffff'
            },
            popover: {
                DEFAULT: '#120b2e',
                foreground: '#ffffff'
            },
            primary: {
                DEFAULT: '#8B5CF6', // Vivid Purple
                foreground: '#ffffff'
            },
            secondary: {
                DEFAULT: '#4c1d95', // Darker purple
                foreground: '#ffffff'
            },
            muted: {
                DEFAULT: '#1e1b4b', // Muted dark blue
                foreground: '#A1A1AA' // Grey text
            },
            accent: {
                DEFAULT: '#0EA5E9', // Electric Blue
                foreground: '#ffffff'
            },
            destructive: {
                DEFAULT: '#ef4444', // Red for delete actions
                foreground: '#ffffff'
            },
            border: '#2e236b', // Subtle purple border
            input: '#1e1b4b',
            ring: '#8B5CF6',
            chart: {
                '1': 'hsl(var(--chart-1))',
                '2': 'hsl(var(--chart-2))',
                '3': 'hsl(var(--chart-3))',
                '4': 'hsl(var(--chart-4))',
                '5': 'hsl(var(--chart-5))'
            }
        },
        borderRadius: {
            lg: 'var(--radius)',
            md: 'calc(var(--radius) - 2px)',
            sm: 'calc(var(--radius) - 4px)'
        },
        keyframes: {
            'accordion-down': {
                from: { height: '0' },
                to: { height: 'var(--radix-accordion-content-height)' }
            },
            'accordion-up': {
                from: { height: 'var(--radix-accordion-content-height)' },
                to: { height: '0' }
            }
        },
        animation: {
            'accordion-down': 'accordion-down 0.2s ease-out',
            'accordion-up': 'accordion-up 0.2s ease-out'
        },
        backgroundImage: {
            'glow-gradient': 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(3,0,20,0) 70%)',
            'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a853ba 180deg, #e92a67 360deg)',
        }
    }
  },
  plugins: [require("tailwindcss-animate")],
};