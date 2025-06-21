import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,      // ✅ Node.js environment
        ...globals.es2021     // Optional: Enable ES2021 globals
      },
    },
    plugins: { js },
    extends: ["js/recommended"],
  }
]);
