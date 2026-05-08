import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import {
  componentModulesName as COMPONENTS,
  foundationsModulesName as FOUNDATIONS,
} from '../style-dictionary/configs/filters/modules';

// Define legal secondary namespaces that a component is allowed to export
const COMPONENT_ALIASES: Record<string, string[]> = {
  input: ['label', 'color-icon-checkbox'],
  'toggle-button': ['toggle-group'],
};

// Define legal secondary namespaces that a foundation file is allowed to export
const FOUNDATION_ALIASES: Record<string, string[]> = {
  'breakpoint-mixins': ['breakpoint'],
  'motion-timing': ['timing'],
  'motion-duration': ['duration'],
  'text-style': ['transform', 'text-eyebrow', 'text-italic'],
  'space-icon': ['icon-size'],
};

function extractNormalizedTokens(filePath: string, content: string): string[] {
  const ext = path.extname(filePath);
  const tokens = new Set<string>();

  if (ext === '.scss') {
    const scssRegex = /\$cdr-([a-zA-Z0-9-]+):/g;
    let match;

    while ((match = scssRegex.exec(content)) !== null) tokens.add(match[1]);
  } else if (ext === '.css') {
    const cssRegex = /--cdr-([a-zA-Z0-9-]+):/g;
    let match;

    while ((match = cssRegex.exec(content)) !== null) tokens.add(match[1]);
  } else if (ext === '.ts') {
    const tsRegex = /export const (Cdr[a-zA-Z0-9]+)/g;
    let match;

    while ((match = tsRegex.exec(content)) !== null) {
      const kebabCase = match[1]
        .replace(/^Cdr/, '')
        .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
        .toLowerCase()
        .replace(/^-/, '');
      tokens.add(kebabCase);
    }
  } else if (ext === '.json') {
    const parsed = JSON.parse(content);

    const walkNode = (node: any, path: string[]) => {
      if (!node || typeof node !== 'object') return;

      if ('value' in node || '$value' in node) {
        if (Array.isArray(node.path)) {
          tokens.add(node.path.join('-').replace(/^cdr-/, ''));
        } else if (node.name) {
          tokens.add(node.name.replace(/^cdr-/, ''));
        } else {
          tokens.add(path.join('-').replace(/^cdr-/, ''));
        }
        return;
      }

      if (Array.isArray(node)) {
        node.forEach((item) => {
          if (item && typeof item === 'object') {
            if (item.name) {
              tokens.add(item.name.replace(/^cdr-/, ''));
            } else {
              walkNode(item, path);
            }
          }
        });
        return;
      }

      for (const key in node) {
        if (key === 'docs' || key === 'attributes' || key === 'original') continue;

        if (typeof node[key] === 'object') {
          walkNode(node[key], [...path, key]);
        } else if (typeof node[key] === 'string' || typeof node[key] === 'number') {
          if (key.startsWith('cdr-')) {
            tokens.add(key.replace(/^cdr-/, ''));
          }
        }
      }
    };

    walkNode(parsed, []);
  }

  return Array.from(tokens);
}

function runOutputParityCheck() {
  console.log('********** Running Post-Build Parity Check on dist/rei-dot-com... **********');

  const outputFiles = globSync('dist/rei-dot-com/**/**/*.{css,scss,json,ts}');
  const errors: string[] = [];

  const containsKeyword = (tokenStr: string, keyword: string, componentToken: boolean = false) => {
    if (componentToken) {
      const normalizedToken = `-${tokenStr}-`;
      const normalizedKeyword = `-${keyword}-`;

      return normalizedToken.includes(normalizedKeyword);
    }

    // Foundations must always be the exact prefix
    return tokenStr.startsWith(`${keyword}-`);
  };

  outputFiles.forEach((file) => {
    const fileName = path.basename(file, path.extname(file)).replace(/\.d$/, '');
    const content = fs.readFileSync(file, 'utf-8');
    const tokens = extractNormalizedTokens(file, content);

    const normalizedFileName = fileName.replace(/^cdr-/, '');

    const isComponentFile = COMPONENTS.some((c) => normalizedFileName === c);
    const isFoundationFile = FOUNDATIONS.some(
      (f) => normalizedFileName === f || normalizedFileName.startsWith(`${f}-`),
    );

    tokens.forEach((token) => {
      // RULE 1: Foundation files
      if (isFoundationFile && !isComponentFile) {
        const allowedNamespaces = [
          normalizedFileName,
          ...(FOUNDATION_ALIASES[normalizedFileName] || []),
        ];

        // Support "Sandwich" namespaces (e.g. text-*-line-height)
        const isMatch = allowedNamespaces.some((namespace) => {
          // Check 1: Direct Prefix (e.g. 'color-background-primary')
          if (token.startsWith(namespace)) return true;

          // Check 2: Sandwich Check (e.g. 'text-body-line-height' matches 'text-line-height')
          const nsParts = namespace.split('-');
          if (nsParts.length >= 2) {
            const first = nsParts[0];
            const last = nsParts[nsParts.length - 1];
            return token.startsWith(`${first}-`) && token.endsWith(`-${last}`);
          }
          return false;
        });

        if (!isMatch) {
          errors.push(
            `[Foundation Leak]: Token '${token}' in file '${file}' does not match namespace or allowed patterns ('${allowedNamespaces.join(
              "', '",
            )}').`,
          );
        }

        const offendingComponent = COMPONENTS.find((c) => {
          const isSelfReferential = allowedNamespaces.some((ns) => ns.includes(c));

          return !isSelfReferential && containsKeyword(token, c);
        });

        if (offendingComponent) {
          errors.push(
            `[Foundation Leak]: Foundation file '${file}' contains component reference '${offendingComponent}' within token '${token}'.`,
          );
        }
      }

      // RULE 2: Component files
      if (isComponentFile) {
        const matchingComponent = COMPONENTS.find((c) => normalizedFileName === c);

        if (matchingComponent) {
          const allowedNamespaces = [
            matchingComponent,
            ...(COMPONENT_ALIASES[matchingComponent] || []),
          ];

          const isValid = allowedNamespaces.some((namespace) =>
            containsKeyword(token, namespace, true),
          );

          if (!isValid) {
            errors.push(
              `[Component Leak]: Component file '${file}' is exporting out-of-scope token '${token}'. Expected namespace(s): '${allowedNamespaces.join(
                "', '",
              )}'.`,
            );
          }
        }
      }
    });
  });

  if (errors.length > 0) {
    console.error('\n Output Parity Validation Failed:');
    errors.forEach((err) => console.error(`  - ${err}`));
    process.exit(1);
  }

  console.log(
    '********** Output Parity Validated Successfully. No cross-contamination found. **********',
  );
}

runOutputParityCheck();
