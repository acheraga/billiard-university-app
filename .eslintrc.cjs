module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:prettier/recommended",
    "prettier",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    // project-specific rules
    "no-console": "off",
    "vue/html-indent": "off",
    "prettier/prettier": ["error", { endOfLine: "auto" }],
  },
};
