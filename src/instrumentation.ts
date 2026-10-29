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

/** Every minute, tells students when a test opens, results are out or an opportunity is posted. */
function startTestOpenNotifier() {
  let running = false;
  const tick = async () => {
    if (running) return;
    running = true;
    try {
      const { runAutoNotifications } = await import("./lib/test-notifications");
      const { opened, results, posts } = await runAutoNotifications();
      if (opened + results + posts > 0) {
        console.log(
          `[notify] tests opened: ${opened}, results out: ${results}, new posts: ${posts}`,
        );
      }
    } catch (err) {
      console.error("[notify] could not send notifications", err);
    } finally {
      running = false;
    }
  };
  setTimeout(tick, 15_000).unref();
  setInterval(tick, 60_000).unref();
}
