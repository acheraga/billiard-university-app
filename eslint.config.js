import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import parser from "vue-eslint-parser";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["dist", "node_modules", "*.config.ts", ".github", "vite-env.d.ts"],
  },
  js.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  {
    files: ["src/**/*.vue"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: parser,
      parserOptions: {
        parser: tsParser,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Browser APIs
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        alert: "readonly",
        confirm: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        requestAnimationFrame: "readonly",
        localStorage: "readonly",
        URL: "readonly",
        DOMRect: "readonly",
        KeyboardEvent: "readonly",
        TouchEvent: "readonly",
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Project-specific rules
      "no-console": "off",
      "vue/html-indent": "off",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_|^e$|^err$" }],
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsParser,
      globals: {
        // Browser APIs
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        alert: "readonly",
        confirm: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        requestAnimationFrame: "readonly",
        localStorage: "readonly",
        URL: "readonly",
        DOMRect: "readonly",
        KeyboardEvent: "readonly",
        TouchEvent: "readonly",
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Project-specific rules
      "no-console": "off",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_|^e$|^err$" }],
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
  prettierConfig,
];
