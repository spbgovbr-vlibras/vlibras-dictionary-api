module.exports = {
  extends: "airbnb-base",
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
