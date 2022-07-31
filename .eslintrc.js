module.exports = {
	'env': {
		'node': true,
		'commonjs': true,
		'es2021': true
	},
	'extends': ['eslint:recommended', 'plugin:security-node/recommended'],
	'parserOptions': {
		'ecmaVersion': 'latest'
	},
	'overrides': [
		{ 'files': [ 'test/**' ], 'plugins': [ 'jest' ], 'extends': [ 'plugin:jest/recommended' ],}
	],
	'rules': {
		'indent': [
			'off',
			'tab'
		],
		'quotes': [
			'warn',
			'single'
		],
		'semi': [
			'warn',
			'always'
		],
		'security-node/non-literal-reg-expr': 'off'
	}
};
