/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    styled: true,
    themes: [
      {
        mytheme: {
          primary: '#FFA62B',
          secondary: '#0F1108',
          accent: '#EA5234',
          neutral: '#b3b3b3',
          'base-100': '#ffffff',
          info: '#3ABFF8',
          success: '#17BEBB',
          warning: '#FBBD23',
          error: '#F05D5E',
        },
      },
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: '',
    darkTheme: 'mytheme',
  },
};
