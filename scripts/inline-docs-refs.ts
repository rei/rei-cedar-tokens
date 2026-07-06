/**
 * Inlines all {text.*.doc*} references in docs properties of tokens/mobile/text.json
 * SD v5 resolves ALL {..} patterns (not just $value), so these non-token references fail.
 */
import fs from 'fs';

const filePath = 'tokens/mobile/text.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

/**
 * Resolve a reference path like "text.default.display1.docCategory" against the data tree
 */
function resolveRef(path: string, root: any): string | undefined {
  const parts = path.split('.');
  let target = root;
  for (const part of parts) {
    if (target && typeof target === 'object' && part in target) {
      target = target[part];
    } else {
      return undefined;
    }
  }
  return typeof target === 'string' ? target : undefined;
}

/**
 * Recursively process docs properties to resolve {text.*.doc*} references
 */
function processDocs(obj: any, root: any): void {
  if (!obj || typeof obj !== 'object') return;

  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'string' && key !== '$value' && key !== '$type') {
      // Check if it's a reference
      const match = val.match(/^\{([^}]+)\}$/);
      if (match) {
        const refPath = match[1];
        // Only resolve text.*.doc* references
        if (refPath.startsWith('text.') && refPath.includes('.doc')) {
          const resolved = resolveRef(refPath, root);
          if (resolved !== undefined) {
            obj[key] = resolved;
          }
        }
      }
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      processDocs(val, root);
    } else if (Array.isArray(val)) {
      for (const item of val) {
        if (item && typeof item === 'object') {
          processDocs(item, root);
        }
      }
    }
  }
}

processDocs(data, data);

fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
console.log(`Inlined docs references in ${filePath}`);
