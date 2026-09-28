import { basename } from 'node:path';

export const toPascalCase = (value: string): string => {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
};

export const getModuleBaseName = (destination?: string): string => {
  if (!destination) {
    throw new Error('TypeScript module formats require a file destination');
  }

  return basename(destination).replace(/(\.(names|keys))?\.(d\.)?(ts|mjs|cjs)$/, '');
};

export const getModuleName = (destination?: string): string => {
  return toPascalCase(getModuleBaseName(destination));
};

export const getModuleTypeName = (destination?: string): string => {
  return `${getModuleName(destination)}Tokens`;
};

export const getValueName = (destination?: string): string => {
  return getModuleName(destination);
};

export const getModuleTokenNameTypeName = (destination?: string): string => {
  return `${getModuleName(destination)}TokenName`;
};
