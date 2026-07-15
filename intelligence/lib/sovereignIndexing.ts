/**
 * JWORDENAI: Sovereign Priority Indexing Engine
 * -----------------------------------------------
 * Submits URLs to the Google Indexing API v3 for priority crawl scheduling.
 * Targets Virginia, Texas, and Michigan KFC/KBP "Whale" asset pages first.
 * Leverages jwordenasphaltpaving.com 2014 domain authority as the sovereign anchor
 * for 50-state national indexing.
 *
 * Requirements:
 *   - Set GOOGLE_SERVICE_ACCOUNT_JSON env var to the JSON of a Google service account
 *     that has been granted "Owner" access in Google Search Console for the property.
 *   - The service account must have the role "indexing" scope enabled.
 *
 * Ref: https://developers.google.com/search/apis/indexing-api/v3/quickstart
 */

import { google } from 'googleapis';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type IndexingType = 'URL_UPDATED' | 'URL_DELETED';

export interface IndexingResult {
  url: string;
  type: IndexingType;
  status: 'PRIORITY_QUEUE_ACTIVE' | 'SKIPPED' | 'ERROR';
  eta: string;
  notifyTime?: string;
  error?: string;
}

export interface BatchIndexingResult {
  submitted: number;
  skipped: number;
  errors: number;
  results: IndexingResult[];
}

// ---------------------------------------------------------------------------
// Whale target pages — priority queue for KFC/KBP franchise markets
// These get submitted first in every batch run.
// ---------------------------------------------------------------------------

export const WHALE_PRIORITY_URLS: string[] = [
  // Virginia KBP/KFC Whale Assets
  'https://www.jwordenasphaltpaving.com/locations/richmond',
  'https://www.jwordenasphaltpaving.com/locations/chesterfield',
  'https://www.jwordenasphaltpaving.com/locations/henrico',
  'https://www.jwordenasphaltpaving.com/locations/mechanicsville',
  'https://www.jwordenasphaltpaving.com/locations/midlothian',
  'https://www.jwordenasphaltpaving.com/locations/glen-allen',
  'https://www.jwordenasphaltpaving.com/locations/chester',
  'https://www.jwordenasphaltpaving.com/locations/colonial-heights',
  'https://www.jwordenasphaltpaving.com/locations/hopewell',
  'https://www.jwordenasphaltpaving.com/locations/petersburg',
  'https://www.jwordenasphaltpaving.com/locations/virginia-beach',
  'https://www.jwordenasphaltpaving.com/locations/norfolk',
  'https://www.jwordenasphaltpaving.com/locations/hampton',
  'https://www.jwordenasphaltpaving.com/locations/chesapeake',
  'https://www.jwordenasphaltpaving.com/locations/suffolk',
  // Texas Whale Assets
  'https://www.jwordenasphaltpaving.com/locations/houston',
  'https://www.jwordenasphaltpaving.com/locations/dallas',
  'https://www.jwordenasphaltpaving.com/locations/austin',
  'https://www.jwordenasphaltpaving.com/locations/san-antonio',
  'https://www.jwordenasphaltpaving.com/locations/fort-worth',
  // Michigan KBP/KFC Whale Assets — leveraging 2014 domain authority
  'https://www.jwordenasphaltpaving.com/locations/detroit',
  'https://www.jwordenasphaltpaving.com/locations/grand-rapids',
  'https://www.jwordenasphaltpaving.com/locations/lansing',
  'https://www.jwordenasphaltpaving.com/locations/ann-arbor',
  'https://www.jwordenasphaltpaving.com/locations/sterling-heights',
  // Core service pages
  'https://www.jwordenasphaltpaving.com/',
  'https://www.jwordenasphaltpaving.com/commercial',
  'https://www.jwordenasphaltpaving.com/gc-bid',
  'https://www.jwordenasphaltpaving.com/whale-hunter',
  'https://www.jwordenasphaltpaving.com/estimator',
];

// ---------------------------------------------------------------------------
// Auth helper — loads service account from environment
// ---------------------------------------------------------------------------

function getAuth() {
  const raw = process.env['GOOGLE_SERVICE_ACCOUNT_JSON'];
  if (!raw) {
    throw new Error(
      'JWORDENAI: GOOGLE_SERVICE_ACCOUNT_JSON env var is not set. ' +
        'Download your service account key from Google Cloud Console and set it.'
    );
  }

  const credentials = JSON.parse(raw) as {
    client_email: string;
    private_key: string;
  };

  return new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });
}

// ---------------------------------------------------------------------------
// Core: notify a single URL
// ---------------------------------------------------------------------------

export const JWORDENAI_Indexer = {
  scope: 'https://www.googleapis.com/auth/indexing' as const,

  /**
   * Submits a single URL to the Google Indexing API v3.
   * Defaults to URL_UPDATED (new or refreshed content).
   */
  async notify(
    url: string,
    type: IndexingType = 'URL_UPDATED'
  ): Promise<IndexingResult> {
    console.log(`JWORDENAI: Pinging Google for priority crawl: ${url}`);

    if (!process.env['GOOGLE_SERVICE_ACCOUNT_JSON']) {
      console.warn(
        'JWORDENAI: GOOGLE_SERVICE_ACCOUNT_JSON not set — skipping live API call.'
      );
      return {
        url,
        type,
        status: 'SKIPPED',
        eta: 'N/A — credentials required',
      };
    }

    try {
      const auth = getAuth();
      const indexing = google.indexing({ version: 'v3', auth });

      const response = await indexing.urlNotifications.publish({
        requestBody: { url, type },
      });

      const notifyTime =
        (
          response.data as { urlNotificationMetadata?: { latestUpdate?: { notifyTime?: string } } }
        ).urlNotificationMetadata?.latestUpdate?.notifyTime ?? new Date().toISOString();

      console.log(`JWORDENAI: ✅ Priority crawl queued → ${url}`);
      return {
        url,
        type,
        status: 'PRIORITY_QUEUE_ACTIVE',
        eta: '6-12 Hours',
        notifyTime,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`JWORDENAI: ❌ Indexing failed for ${url} — ${message}`);
      return { url, type, status: 'ERROR', eta: 'N/A', error: message };
    }
  },

  // ---------------------------------------------------------------------------
  // Batch: submit an array of URLs (respects Google's 200 req/day quota)
  // ---------------------------------------------------------------------------

  /**
   * Submits multiple URLs in sequence with a 200ms delay between requests
   * to stay within Google Indexing API quota (200 URLs/day).
   */
  async notifyBatch(
    urls: string[],
    type: IndexingType = 'URL_UPDATED',
    delayMs = 200
  ): Promise<BatchIndexingResult> {
    console.log(
      `JWORDENAI: Starting batch index submission — ${urls.length} URLs`
    );

    const results: IndexingResult[] = [];

    for (const url of urls) {
      const result = await this.notify(url, type);
      results.push(result);
      if (delayMs > 0 && url !== urls[urls.length - 1]) {
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }

    const submitted = results.filter((r) => r.status === 'PRIORITY_QUEUE_ACTIVE').length;
    const skipped = results.filter((r) => r.status === 'SKIPPED').length;
    const errors = results.filter((r) => r.status === 'ERROR').length;

    console.log(
      `JWORDENAI: Batch complete — ✅ ${submitted} queued | ⏭ ${skipped} skipped | ❌ ${errors} errors`
    );

    return { submitted, skipped, errors, results };
  },

  // ---------------------------------------------------------------------------
  // Whale Strike: submit only the highest-priority KFC/KBP market URLs
  // ---------------------------------------------------------------------------

  /**
   * Priority-indexes all Whale asset pages (Virginia + Texas KFC/KBP markets).
   * Run this after any site deployment or content update.
   */
  async whaleStrike(): Promise<BatchIndexingResult> {
    console.log(
      'JWORDENAI: 🐋 WHALE STRIKE — Priority indexing KFC/KBP market assets'
    );
    return this.notifyBatch(WHALE_PRIORITY_URLS, 'URL_UPDATED');
  },
};

export default JWORDENAI_Indexer;
