/* eslint-disable import/no-commonjs */
module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "universe/node",
    "plugin:promise/recommended",
    "prettier",
  ],
  plugins: [
    "promise",
  ],
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: false,
    },
    sourceType: "module",
  },
  env: {
    es6: true,
    commonjs: true,
    node: true,
    jasmine: true,
  },
  rules: {
    "no-use-before-define": "off",
    "no-shadow": "off",
    "no-extend-native": "off",
    "import/order": "off",

    // promises
    // TODO: The following four should be errors and therefore removed (since we extend the recommended configuration where they are errors)
    "promise/always-return": "warn",
    "promise/no-return-wrap": "off", // use unicorn/no-useless-promise-resolve-reject instead
    "promise/param-names": "warn",
    "promise/catch-or-return": "warn",
  },
};
