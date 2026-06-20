/**
 * Current tenant configuration.
 * To white-label for a new licensee: swap JWORDEN_TENANT for their TenantConfig,
 * or load it from an environment variable / API at startup.
 */
import { JWORDEN_TENANT } from '@jworden/core';
export const CURRENT_TENANT = JWORDEN_TENANT;
