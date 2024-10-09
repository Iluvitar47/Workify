import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      fullwhite: '#ffffff',
      fullblack: '#000000',
      ligth: '#F8F4E3',
      dark: '#060B0F',
      interact : '#F5C800',
      info: '#E71D36',
    },
    fontFamily: {
      poppins: ['Poppins', 'sans-serif'],
    },
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [],
};
export default config;
