module.exports = {
  jit: true,
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      fontSize: {
        tiny: '0.6rem'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
