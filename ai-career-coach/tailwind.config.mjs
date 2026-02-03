import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
            // The new "Disha AI" palette based on your images
  			background: '#030014', // Very deep purple/black
  			foreground: '#ffffff',
  			primary: {
  				DEFAULT: '#8B5CF6', // Vivid Purple
  				foreground: '#ffffff'
  			},
  			secondary: {
  				DEFAULT: '#4c1d95', // Darker purple for gradients
  				foreground: '#ffffff'
  			},
            muted: {
                DEFAULT: '#1e1b4b', // Muted dark blue/purple for cards
                foreground: '#A1A1AA'
            },
            accent: {
                DEFAULT: '#0EA5E9', // Electric Blue for highlights
            }
  		},
        backgroundImage: {
            'glow-gradient': 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(3,0,20,0) 70%)',
            'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a853ba 180deg, #e92a67 360deg)',
        }
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;