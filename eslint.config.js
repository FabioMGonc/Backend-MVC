import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"], 
    plugins: { js }, 
    extends: ["js/recommended", "prettier"],
    plugins: ["prettier"],
    languageOptions: { 
      globals: globals.node },
      rules: {
        "prettier/prettier": "error",
        quotes: ["error", "double"],
        semi: ["error", "always"],
        "camelcase": "off",
        "no-param-reassign": "off",
        "no-unused-vars":["error", {argsIgnorePattern: "next"}],
        "no-console": "off",
      }
  },
]);
