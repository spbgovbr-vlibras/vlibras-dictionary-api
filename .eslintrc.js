module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "no-console": [
      "error",
      {
        allow: [
          "error"
        ],
      },
    ],
    "no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
      },
    ],
    "no-param-reassign": [
      "error",
      {
        "props": false
      },
    ],
    "no-restricted-syntax": [
      "error",
      "ForInStatement",
    ],
  },
};
