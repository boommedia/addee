import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#1f2937',
        primary: '#ef4444',
        'primary-light': '#fecaca',
        'primary-dark': '#991b1b',
        border: '#e5e7eb',
        'text-muted': '#6b7280',
      },
    },
  },
  plugins: [],
}
export default config
