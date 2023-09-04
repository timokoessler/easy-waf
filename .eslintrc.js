module.exports = {
    env: {
        node: true,
        es2021: true,
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: ['plugin:@typescript-eslint/eslint-recommended', 'plugin:@typescript-eslint/recommended'],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        indent: ['off', 'tab'],
        quotes: ['warn', 'single'],
        semi: ['warn', 'always'],
        'security-node/non-literal-reg-expr': 'off',
    },
};
