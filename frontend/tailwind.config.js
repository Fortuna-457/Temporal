/** @type {(tailwindConfig: object) => object} */
const withMt = require('@material-tailwind/react/utils/withMT')
module.exports = withMt({
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {}
  },
  plugins: []
})
