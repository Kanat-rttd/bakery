module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        // 'plugin:react-hooks/recommended',
        'plugin:prettier/recommended',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    plugins: ['react', 'react-refresh', 'prettier'],
    rules: {
        'prettier/prettier': 'error',
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        '@typescript-eslint/no-explicit-any': 'warn',
        'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
    },
}
