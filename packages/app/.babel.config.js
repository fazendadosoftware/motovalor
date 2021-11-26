module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ts',
          '.tsx',
          '.jsx',
          '.js',
          '.json'
        ],
        alias: {
          '@': './src'
        }
      }
    ]
  ]
}
