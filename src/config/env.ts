export interface CoreConfig {
  env: "dev" | "staging" | "prod" | "test";
  logLevel: "debug" | "info" | "warn" | "error";
}

/**
 * Minimal configuration helper for the core library. Higher-level services
 * (operator, api, prism) should extend this with richer configuration.
 */
export function getCoreConfig(): CoreConfig {
  const env = (process.env.NODE_ENV as CoreConfig["env"]) || "dev";
  const logLevel = (process.env.CORE_LOG_LEVEL as CoreConfig["logLevel"]) || "info";
  return { env, logLevel };
}
