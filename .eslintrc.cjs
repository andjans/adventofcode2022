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
    "unicorn",
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

    // unicorn: https://github.com/sindresorhus/eslint-plugin-unicorn
    // disabled
    "unicorn/filename-case": "off", // we don't use kebab-case
    "unicorn/no-null": "off", // react uses null
    "unicorn/empty-brace-spaces": "off", // controlled by prettier
    "unicorn/no-useless-undefined": "off", // clashes with other rules
    // errors
    "unicorn/no-unnecessary-await": "error",
    "unicorn/no-unsafe-regex": "error",
    // warnings
    "unicorn/better-regex": "warn",
    "unicorn/consistent-destructuring": "warn",
    "unicorn/consistent-function-scoping": "warn",
    "unicorn/error-message": "warn",
    "unicorn/explicit-length-check": "warn",
    "unicorn/new-for-builtins": "warn",
    "unicorn/no-abusive-eslint-disable": "warn",
    "unicorn/no-array-method-this-argument": "warn",
    "unicorn/no-array-push-push": "warn",
    "unicorn/no-await-expression-member": "warn",
    "unicorn/no-console-spaces": "warn",
    "unicorn/no-empty-file": "error",
    "unicorn/no-for-loop": "warn",
    "unicorn/no-hex-escape": "warn",
    "unicorn/no-instanceof-array": "warn",
    "unicorn/no-unused-properties": "warn",
    "unicorn/no-useless-fallback-in-spread": "warn",
    "unicorn/no-useless-length-check": "warn",
    "unicorn/no-useless-promise-resolve-reject": "warn",
    "unicorn/no-useless-spread": "warn",
    "unicorn/no-useless-switch-case": "warn",
    // TODO: Evaluate these auto-fix rules later
    "unicorn/escape-case": "off",
    "unicorn/expiring-todo-comments": "off",
    "unicorn/catch-error-name": "off",
    "unicorn/prevent-abbreviations": "off",
    "unicorn/no-array-for-each": "off",
    "unicorn/no-new-array": "off",
    "unicorn/no-unreadable-array-destructuring": "off",
    "unicorn/no-zero-fractions": "off",
    "unicorn/number-literal-case": "off",
    "unicorn/numeric-separators-style": "off",
    "unicorn/prefer-array-find": "off",
    "unicorn/prefer-array-flat": "off",
    "unicorn/prefer-array-flat-map": "off",
    "unicorn/prefer-array-index-of": "off",
    "unicorn/prefer-array-some": "off",
    "unicorn/prefer-date-now": "off",
    "unicorn/prefer-at": "off",
    "unicorn/prefer-default-parameters": "off",
    "unicorn/prefer-export-from": "off",
    "unicorn/prefer-includes": "off",
    "unicorn/prefer-math-trunc": "off",
    "unicorn/prefer-negative-index": "off",
    "unicorn/prefer-number-properties": "off",
    "unicorn/prefer-optional-catch-binding": "off",
    "unicorn/prefer-prefer-modern-math-apis": "off",
    "unicorn/prefer-module": "off",
    "unicorn/prefer-native-coercion-functions": "off",
    "unicorn/prefer-regexp-test": "off",
    "unicorn/prefer-set-has": "off",
    "unicorn/prefer-spread": "off",
    "unicorn/prefer-string-slice": "off",
    "unicorn/prefer-string-starts-ends-with": "off",
    "unicorn/prefer-string-trim-start-end": "off",
    "unicorn/prefer-switch": "off",
    "unicorn/prefer-ternary": "off",
    "unicorn/prefer-type-error": "off",
    "unicorn/require-array-join-separator": "off",
    "unicorn/require-number-to-fixed-digits-argument": "off",
    "unicorn/switch-case-braces": "off",
    "unicorn/template-indent": "off",
    "unicorn/text-encoding-identifier-case": "off",
    "unicorn/throw-new-error": "off",

    // TODO: Enable and fix when we have migrated to TypeScript
    "no-undef": "off",
    "no-unsafe-optional-chaining": "warn",
  },
};
