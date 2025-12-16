import js from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier"
import onlyWarn from "eslint-plugin-only-warn"
import turboPlugin from "eslint-plugin-turbo"
import tsPlugin from "@typescript-eslint/eslint-plugin"

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  {
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      project: "./tsconfig.json",
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    extends: ["plugin:@typescript-eslint/recommended"],
  },
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: ["dist/**"],
  },
]
