// ! DO NOT MODIFY
/**@type import('eslint').Linter.Config*/
module.exports = {
  settings: {
    react: {
      version: "detect",
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:react/recommended",
  ],
  overrides: [
    {
      files: ["**/*.spec.js"],
      extends: ["plugin:cypress/recommended"],
    },
  ],
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    project: `${__dirname}/tsconfig.eslint.json`,
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "no-unused-vars": [0],
    "@typescript-eslint/explicit-function-return-type": [2],
  },
};
