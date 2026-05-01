import globalTokensJson from '../dist/rei-dot-com/json/global.json';

type TokenNode = {
  name?: string;
  docs?: {
    description?: string | Record<string, unknown>;
  };
};

const toPascalTokenName = (kebabName: string): string => {
  return kebabName
    .split('-')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
};

const asReadableText = (description: string | Record<string, unknown>): string => {
  if (typeof description === 'string') {
    return description;
  }

  const what = typeof description.what === 'string' ? description.what : '';
  const when = typeof description.when === 'string' ? description.when : '';
  const alternatives = Array.isArray(description.alternatives)
    ? description.alternatives.map(String).join(', ')
    : '';

  const base = [what, when].filter(Boolean).join(' ');
  if (!alternatives) {
    return base;
  }

  return `${base}${base ? ' ' : ''}Alternatives: ${alternatives}`.trim();
};

const walk = (node: unknown, collector: Map<string, string>): void => {
  if (Array.isArray(node)) {
    node.forEach((entry) => walk(entry, collector));
    return;
  }

  if (typeof node !== 'object' || node === null) {
    return;
  }

  const token = node as TokenNode;
  if (typeof token.name === 'string' && token.docs?.description) {
    const description = asReadableText(token.docs.description).trim();
    if (description) {
      collector.set(toPascalTokenName(token.name), description);
    }
  }

  Object.values(node).forEach((value) => walk(value, collector));
};

const tokenDocs = new Map<string, string>();
walk(globalTokensJson, tokenDocs);

export const getTokenDescription = (tokenName: string): string => tokenDocs.get(tokenName) ?? '';
