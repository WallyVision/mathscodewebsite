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
  startTestOpenNotifier();
}

/** Every minute, tells students when a test has just opened. */
function startTestOpenNotifier() {
  let running = false;
  const tick = async () => {
    if (running) return;
    running = true;
    try {
      const { notifyOpenedTests } = await import("./lib/test-notifications");
      const announced = await notifyOpenedTests();
      if (announced > 0) console.log(`[notify] announced ${announced} newly opened test(s)`);
    } catch (err) {
      console.error("[notify] could not send test notifications", err);
    } finally {
      running = false;
    }
  };
  setTimeout(tick, 15_000).unref();
  setInterval(tick, 60_000).unref();
}
