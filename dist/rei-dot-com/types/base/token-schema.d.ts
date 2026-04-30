/* eslint-disable */
// This file is auto-generated from schema/token.schema.json. Do not edit manually.
// Schema: https://github.com/rei/rei-cedar-tokens/schema/token.schema.json
// Title: Cedar token file
export type TokenValuePrimitive = string | number | boolean;
export type TokenValueComposite = Record<string, string | number>;
export type TokenValue = TokenValuePrimitive | TokenValueComposite;
export type TokenPropertyName = "$value" | "$type" | "docs" | "mixin" | "property" | "utility-class" | "newToken" | "newMixin" | "spacingModifier";
export interface TokenDescriptionDetails {
  readonly what: string;
  readonly when: string;
  readonly alternatives?: string[];
}
export type TokenDescription = string | TokenDescriptionDetails;
export interface TokenDocs {
  readonly category: string;
  readonly type: string;
  readonly example: string;
  readonly description: TokenDescription;
}
export interface TokenAttributes {
  readonly mixin?: string;
  readonly property?: string;
  readonly "utility-class"?: boolean;
  readonly newToken?: string;
  readonly newMixin?: string;
  readonly spacingModifier?: string;
}
export interface Token extends TokenAttributes {
  readonly $value: TokenValue;
  readonly $type: string;
  readonly docs: TokenDocs;
}
export type TokenLeaf = Token;
export interface TokenGroup {
  readonly [key: string]: TokenNodeOrGroup;
}
export type TokenNodeOrGroup = TokenLeaf | TokenGroup;
export interface TokenSchema {
  readonly [key: string]: TokenNodeOrGroup;
}