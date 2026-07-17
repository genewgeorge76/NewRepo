/**
 * sentry.ts — Front-end error reporting bootstrap.
 *
 * Activates only when VITE_SENTRY_DSN is present. Safe no-op otherwise so
 * local dev and PR previews stay quiet.
 *
 * Tunables (all optional):
 *   VITE_SENTRY_DSN              — required to enable
 *   VITE_SENTRY_ENVIRONMENT      — defaults to import.meta.env.MODE
 *   VITE_SENTRY_TRACES_RATE      — float 0..1, defaults to 0.1
 *   VITE_SENTRY_REPLAY_RATE      — session replays, defaults to 0
 *   VITE_SENTRY_REPLAY_ERROR_RATE — replays on error, defaults to 1
 *   VITE_SENTRY_RELEASE          — git sha or build id (set by CI)
 */
import * as Sentry from '@sentry/react';

const DSN = import.meta.env.VITE_SENTRY_DSN as string | undefined;

const DSN_PATTERN = /^https:\/\/[^@]+@[^/]+\.ingest\.[^/]+\/\d+/;

export function initSentry(): void {
  if (!DSN || !DSN_PATTERN.test(DSN)) return;

  const env =
    (import.meta.env.VITE_SENTRY_ENVIRONMENT as string | undefined) ??
    import.meta.env.MODE ??
    'production';

  const tracesRate = Number(
    import.meta.env.VITE_SENTRY_TRACES_RATE ?? '0.1',
  );
  const replayRate = Number(
    import.meta.env.VITE_SENTRY_REPLAY_RATE ?? '0',
  );
  const replayErrorRate = Number(
    import.meta.env.VITE_SENTRY_REPLAY_ERROR_RATE ?? '1',
  );
  const release = import.meta.env.VITE_SENTRY_RELEASE as string | undefined;

  Sentry.init({
    dsn: DSN,
    environment: env,
    release,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({ maskAllText: false, blockAllMedia: false }),
    ],
    tracesSampleRate: Number.isFinite(tracesRate) ? tracesRate : 0.1,
    replaysSessionSampleRate: Number.isFinite(replayRate) ? replayRate : 0,
    replaysOnErrorSampleRate: Number.isFinite(replayErrorRate) ? replayErrorRate : 1,
    // Keep PII off by default — paving customers leave phone numbers in forms.
    sendDefaultPii: false,
    beforeSend(event) {
      // Drop network noise from browser extensions.
      const msg = event.exception?.values?.[0]?.value ?? '';
      if (/extension|chrome-extension/i.test(msg)) return null;
      return event;
    },
  });
}

export { Sentry };
