/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module"
  },
  env: {
    es2022: true,
    node: true
  },
  ignorePatterns: ["dist", ".next", "coverage"],
  rules: {
    "no-console": "off"
  }
};

export default config;
