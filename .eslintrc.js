module.exports = {
	'env': {
		'browser': true,
		'es2021': true
	},
	'settings': {
    'import/resolver': {
      typescript: {} // this loads <rootdir>/tsconfig.json to eslint
    },
  },
	'extends': [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'airbnb-base',
	],
	'parser': '@typescript-eslint/parser',
	'parserOptions': {
		'ecmaVersion': 'latest',
		'sourceType': 'module'
	},
	'plugins': [
		'@typescript-eslint',
	],
	'rules': {
		'import/prefer-default-export': 'off',
		'indent': [
			2,
			'tab'
		],
		'no-tabs': 0,
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		],
		'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
		'import/extensions': [
      'error',
      'ignorePackages',
      {
        'ts': 'never',
      }
   ],
	 'class-methods-use-this': 'off'
	}
}
