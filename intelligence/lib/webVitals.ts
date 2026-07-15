/**
 * webVitals.ts — Real-user performance monitoring.
 *
 * Captures Core Web Vitals (LCP, INP, CLS, FCP, TTFB) and pipes them to:
 *   - Sentry (as measurements, attached to a "web-vitals" transaction)
 *   - Google Analytics 4 (as `web_vitals` events, when gtag is present)
 *   - console.debug, when VITE_DEBUG_VITALS=1
 *
 * Safe to call unconditionally. No-ops if neither sink is configured.
 */
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';
import { Sentry } from './sentry';

type Win = Window & {
  gtag?: (...args: unknown[]) => void;
};

function ratingToTag(rating: Metric['rating']): string {
  return rating ?? 'needs-improvement';
}

function send(metric: Metric): void {
  const value = metric.name === 'CLS' ? metric.value * 1000 : metric.value;
  const rounded = Math.round(value);

  // 1) Sentry — drop a measurement so dashboards can chart p50/p75/p95.
  try {
    Sentry.setMeasurement?.(metric.name, value, metric.name === 'CLS' ? '' : 'millisecond');
    Sentry.setTag?.(`vitals.${metric.name.toLowerCase()}.rating`, ratingToTag(metric.rating));
  } catch {
    // Sentry may not have initialized — silently skip.
  }

  // 2) GA4 — standard `web_vitals` event shape.
  const w = window as Win;
  if (typeof w.gtag === 'function') {
    w.gtag('event', metric.name, {
      event_category: 'web_vitals',
      event_label: metric.id,
      value: rounded,
      metric_id: metric.id,
      metric_value: value,
      metric_delta: metric.delta,
      metric_rating: ratingToTag(metric.rating),
      non_interaction: true,
    });
  }

  // 3) Local debug.
  if (import.meta.env.VITE_DEBUG_VITALS === '1') {
    // eslint-disable-next-line no-console
    console.debug('[vitals]', metric.name, rounded, metric.rating, metric.id);
  }
}

let started = false;
export function initWebVitals(): void {
  if (started || typeof window === 'undefined') return;
  started = true;
  onCLS(send);
  onFCP(send);
  onINP(send);
  onLCP(send);
  onTTFB(send);
}
