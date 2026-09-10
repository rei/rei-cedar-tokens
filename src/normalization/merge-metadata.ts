import { isRecord, isTokenLeaf } from '../utils.js';

/**
 * merge-metadata.ts
 *
 * Merges repo-owned token metadata manifest into the canonical token tree.
 * Executed after Figma normalization (step 4 in normalize.ts) so all canonical
 * tokens exist, then walks the canonical tree and attaches matching metadata
 * into $extensions.cedar.governance.
 *
 * This enforces the governance model:
 *   - Figma docs (summary, usage, design) remain in $extensions.cedar.docs
 *   - Repo governance (status, badges, deprecation, usedBy, etc.) go into $extensions.cedar.governance
 *   - Both are always present at merge time; never overwrite or delete
 *
 * If metadata.json doesn't exist, build proceeds with all tokens marked
 * "unreviewed" status (backward compatible).
 */

import type { TokenMetadataManifest } from '../types/token-metadata.js';

/**
 * Traverse the canonical tree and attach governance metadata.
 * Returns count of metadata entries actually merged (for logging).
 *
 * Keys are dot-notation canonical paths:
 *   "color.modes.default.surface.base"
 *   "spacing.scale.-50"
 *   etc.
 */
export function mergeMetadata(
  canonical: Record<string, unknown>,
  metadata: TokenMetadataManifest,
): number {
  let mergedCount = 0;

  function walk(node: unknown, path: string[]): void {
    if (isTokenLeaf(node)) {
      const pathKey = path.join('.');
      if (pathKey in metadata) {
        const gov = metadata[pathKey];
        if (!node.$extensions) {
          node.$extensions = {};
        }
        if (!node.$extensions.cedar) {
          node.$extensions.cedar = {};
        }

        // Attach governance under cedar namespace, avoiding any Figma docs collision
        node.$extensions.cedar.governance = gov;
        mergedCount++;
      }
      return;
    }

    if (!isRecord(node)) {
      return;
    }

    for (const [key, child] of Object.entries(node)) {
      // Skip metadata keys
      if (key.startsWith('$')) {
        continue;
      }
      walk(child, [...path, key]);
    }
  }

  walk(canonical, []);
  return mergedCount;
}
