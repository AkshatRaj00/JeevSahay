import { FlatConfig, LanguageOptions, ParserOptions, Rules } from '@typescript-eslint/utils/ts-eslint';
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

/**
 * @typedef {Object} ReactConfig
 * @property {string[]} files - Glob patterns for JavaScript/JSX files.
 * @property {FlatConfig.Config[]} extends - ESLint and plugin configuration objects.
 * @property {FlatConfig.LanguageOptions} languageOptions - Language options including globals and parser settings.
 * @property {FlatConfig.Rules} [rules] - Optional ESLint rules overrides.
 */

/**
 * ESLint configuration for React projects.
 * @type {FlatConfig.Config[]}
 */
const config = [
  /** @type {FlatConfig.Config} */
  globalIgnores(['dist']),
  /** @type {FlatConfig.Config} */
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    /** @type {FlatConfig.LanguageOptions} */
    languageOptions: {
      /** @type {Record<string, boolean>} */
      globals: globals.browser,
      /** @type {FlatConfig.ParserOptions} */
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
];

/** @type {FlatConfig.Config[]} */
export default defineConfig(config);