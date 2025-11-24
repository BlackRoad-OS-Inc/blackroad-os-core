module.exports = {
  root: true,
  extends: ["./packages/config/eslint.config.mjs"],
  ignorePatterns: ["apps/web/.next", "apps/desktop/src-tauri/target"]
};
