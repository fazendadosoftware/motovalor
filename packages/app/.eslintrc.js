module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  extends: [
    'standard-with-typescript',
    'plugin:vue/vue3-recommended'
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 12,
    sourceType: 'module',
    project: ['./tsconfig.json'],
    extraFileExtensions: ['.vue']
  },
  plugins: [
    'vue',
    '@typescript-eslint'
  ],
  rules: {
    'no-unused-vars': 'off',
    'vue/script-setup-uses-vars': 'error',
    'vue/max-attributes-per-line': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'vue/require-default-prop': 'off',
    'vue/no-deprecated-slot-attribute': 'off'
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly'
  }
}
