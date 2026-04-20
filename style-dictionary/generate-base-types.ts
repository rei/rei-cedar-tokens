import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

type JsonSchema = {
  $id?: string;
  title?: string;
  additionalProperties?: JsonSchema;
  properties?: Record<string, JsonSchema>;
  propertyNames?: JsonSchema;
  required?: string[];
  oneOf?: JsonSchema[];
  items?: JsonSchema;
  type?: string | string[];
  enum?: string[];
  $defs?: Record<string, JsonSchema>;
};

const SCHEMA_PATH = resolve(process.cwd(), 'schema/token.schema.json');
const OUTPUT_PATH = resolve(process.cwd(), 'dist/types/base/token-schema.d.ts');

const quoteProperty = (propertyName: string): string => {
  return /^[$A-Z_a-z][$\w]*$/.test(propertyName) ? propertyName : JSON.stringify(propertyName);
};

const getObjectType = (
  schema: JsonSchema | undefined,
  fallback = 'Record<string, unknown>',
): string => {
  if (!schema) {
    return fallback;
  }

  const valueTypes = schema.type;
  if (Array.isArray(valueTypes)) {
    return valueTypes
      .map((valueType) =>
        valueType === 'string' || valueType === 'number' || valueType === 'boolean'
          ? valueType
          : 'unknown',
      )
      .join(' | ');
  }

  if (valueTypes === 'string' || valueTypes === 'number' || valueTypes === 'boolean') {
    return valueTypes;
  }

  if (valueTypes === 'array') {
    return `${getObjectType(schema.items, 'unknown')}[]`;
  }

  return fallback;
};

const renderTokenSchemaTypes = (schema: JsonSchema): string => {
  const defs = schema.$defs ?? {};
  const tokenLeaf = defs.tokenLeaf ?? {};
  const tokenValue = defs.tokenValue ?? {};
  const docsObject = defs.docsObject ?? {};
  const docsDescription = docsObject.properties?.description?.oneOf?.[1];
  const tokenValueObject = tokenValue.oneOf?.[1];

  const attributeEntries = Object.entries(tokenLeaf.properties ?? {}).filter(
    ([propertyName]) => !['$value', '$type', 'docs'].includes(propertyName),
  );
  const descriptionEntries = Object.entries(docsDescription?.properties ?? {});
  const descriptionRequired = new Set(docsDescription?.required ?? []);
  const propertyNames = tokenLeaf.propertyNames?.enum ?? [];

  return [
    '/* eslint-disable */',
    '// This file is auto-generated from schema/token.schema.json. Do not edit manually.',
    schema.$id ? `// Schema: ${schema.$id}` : '',
    schema.title ? `// Title: ${schema.title}` : '',
    '',
    'export type TokenValuePrimitive = string | number | boolean;',
    `export type TokenValueComposite = Record<string, ${getObjectType(tokenValueObject?.additionalProperties, 'string | number')}>;`,
    'export type TokenValue = TokenValuePrimitive | TokenValueComposite;',
    '',
    propertyNames.length > 0
      ? `export type TokenPropertyName = ${propertyNames
          .map((propertyName: string) => JSON.stringify(propertyName))
          .join(' | ')};`
      : 'export type TokenPropertyName = string;',
    '',
    'export interface TokenDescriptionDetails {',
    ...descriptionEntries.map(([propertyName, propertySchema]) => {
      const optionalToken = descriptionRequired.has(propertyName) ? '' : '?';
      return `  readonly ${quoteProperty(propertyName)}${optionalToken}: ${getObjectType(propertySchema)};`;
    }),
    '}',
    '',
    'export type TokenDescription = string | TokenDescriptionDetails;',
    '',
    'export interface TokenDocs {',
    '  readonly category: string;',
    '  readonly type: string;',
    '  readonly example: string;',
    '  readonly description: TokenDescription;',
    '}',
    '',
    'export interface TokenAttributes {',
    ...attributeEntries.map(([propertyName, propertySchema]) => {
      return `  readonly ${quoteProperty(propertyName)}?: ${getObjectType(propertySchema)};`;
    }),
    '}',
    '',
    'export interface Token extends TokenAttributes {',
    '  readonly $value: TokenValue;',
    '  readonly $type: string;',
    '  readonly docs: TokenDocs;',
    '}',
    '',
    'export type TokenLeaf = Token;',
    '',
    'export interface TokenGroup {',
    '  readonly [key: string]: TokenNodeOrGroup;',
    '}',
    '',
    'export type TokenNodeOrGroup = TokenLeaf | TokenGroup;',
    '',
    'export interface TokenSchema {',
    '  readonly [key: string]: TokenNodeOrGroup;',
    '}',
    '',
  ]
    .filter(Boolean)
    .join('\n');
};

const generateBaseTypes = async (): Promise<void> => {
  const schema = JSON.parse(await readFile(SCHEMA_PATH, 'utf8')) as JsonSchema;
  const contents = renderTokenSchemaTypes(schema);

  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, contents);

  console.log(`[Cedar] Generated base token types: ${OUTPUT_PATH}`);
};

void generateBaseTypes();
