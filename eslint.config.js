import type { FlatConfig, LanguageOptions, ParserOptions, Rules } from '@typescript-eslint/utils/ts-eslint';
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

/**
 * @typedef {Object} ReactConfig
 * @property {string[]} files - Glob patterns for files this config applies to (e.g., `**/*.{js,jsx}`).
 * @property {FlatConfig.PluginConfig[]} extends - ESLint and plugin configurations to extend (e.g., recommended rules).
 * @property {LanguageOptions} languageOptions - Language-specific options, including globals and parser configuration.
 * @property {Rules} [rules] - Optional ESLint rules to override or extend.
 */

/**
 * Core ESLint configuration for JavaScript/JSX files with React support.
 *
 * @type {FlatConfig.Config[]}
 * @description
 * This configuration:
 * - Ignores the `dist` directory globally via `globalIgnores`.
 * - Applies to all `.js` and `.jsx` files.
 * - Extends:
 *   - ESLint's recommended rules (`js.configs.recommended`),
 *   - React Hooks rules (`reactHooks.configs.flat.recommended`),
 *   - React Refresh for Vite (`reactRefresh.configs.vite`).
 * - Configures browser globals and enables JSX parser support.
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