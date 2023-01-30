module.exports = {
  extends: ['@mate-academy/eslint-config-react-typescript', 'plugin:cypress/recommended', 'plugin:react-hooks/recommended'],
  rules: {
    'max-len': ['error', {
      ignoreTemplateLiterals: true,
      ignoreComments: true,

    }],
    'react-hooks/exhaustive-deps': 'error',
    'jsx-a11y/label-has-associated-control': ["error", {
      assert: "either",
    }],
  },
};
