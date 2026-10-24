/** Runs once when the server starts: a production server refuses to start with bad settings. */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.NODE_ENV !== "production") return;
  const { checkEnv } = await import("./lib/env");
  const { errors, warnings } = checkEnv(process.env);
  for (const warning of warnings) console.warn(`[config] ${warning}`);
  if (errors.length > 0) {
    for (const error of errors) console.error(`[config] ${error}`);
    throw new Error("Invalid configuration. See the [config] messages above.");
  }
}
