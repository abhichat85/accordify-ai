export default {
  plugins: {
    'postcss-import': {},
    'postcss-nested-ancestors': {},
    'postcss-nested': {},
    'postcss-nesting': {},
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? { cssnano: { preset: 'default' } } : {})
  }
}
