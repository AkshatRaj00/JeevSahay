import type { FlatConfig, LanguageOptions, ParserOptions, Rules } from '@typescript-eslint/utils/ts-eslint';
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

/**
 * @typedef {Object} ReactConfig
 * @property {string[]} files - Glob patterns for files this config applies to.
 * @property {FlatConfig.Extends} extends - ESLint and plugin configurations to extend.
 * @property {LanguageOptions} languageOptions - Language-specific options (globals, parser, etc.).
 */

/**
 * Core ESLint configuration for JavaScript/JSX files with React support.
 *
 * @type {FlatConfig.ConfigArray}
 * @description
 * This configuration:
 * - Ignores the `dist` directory globally.
 * - Applies to all `.js` and `.jsx` files.
 * - Extends recommended ESLint rules, React Hooks rules, and React Refresh for Vite.
 * - Configures browser globals and JSX parser support.
 */
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    /** @type {LanguageOptions} */
    languageOptions: {
      /** @type {Record<string, boolean>} */
      globals: globals.browser,
      /** @type {ParserOptions} */
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
]);