module.exports = {
  content: ['./dist/*.html', './src/*.js'],
  theme: {
    extend: {
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(280px, max-content))',
        'auto-fill': 'repeat(auto-fill, minmax(280px, 1fr))',
      },
      gridTemplateRows: {
        'auto-fit': 'repeat(auto-fit, minmax(max-content, 1fr))',
        'auto-fill': 'repeat(auto-fill, minmax(250px, 1fr))',
      },
      fontFamily:{
        'cstm': ['Roboto']
      }
    },
  },
  plugins: [],
}
