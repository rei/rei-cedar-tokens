import { GetLocalVariablesResponse, LocalVariable } from '@figma/rest-api-spec';
import { rgbToHex } from './utils';
import { Token, TokensFile } from './types';

/**
 * Maps a Figma variable resolved type to a design token type.
 *
 * @param variable - The Figma local variable
 * @returns The corresponding token type: 'boolean', 'color', 'number', or 'string'
 */
function tokenTypeFromVariable(variable: LocalVariable) {
  switch (variable.resolvedType) {
    case 'BOOLEAN':
      return 'boolean';
    case 'COLOR':
      return 'color';
    case 'FLOAT':
      return 'number';
    case 'STRING':
      return 'string';
  }
}

/**
 * Extracts the token value from a Figma variable for a specific mode.
 *
 * Handles variable aliases, RGB color values, and primitive types.
 *
 * @param variable - The Figma local variable
 * @param modeId - The mode ID to extract the value for
 * @param localVariables - Map of all local variables (for resolving aliases)
 * @returns The token value as a string, number, or boolean
 * @throws {Error} If the variable value format is invalid
 */
function tokenValueFromVariable(
  variable: LocalVariable,
  modeId: string,
  localVariables: { [id: string]: LocalVariable },
) {
  const value = variable.valuesByMode[modeId];
  if (typeof value === 'object') {
    if ('type' in value && value.type === 'VARIABLE_ALIAS') {
      const aliasedVariable = localVariables[value.id];
      return `{${aliasedVariable.name.replace(/\//g, '.')}}`;
    } else if ('r' in value) {
      return rgbToHex(value);
    }

    throw new Error(`Format of variable value is invalid: ${value}`);
  } else {
    return value;
  }
}

/**
 * Converts Figma local variables into design token files.
 *
 * Creates one token file per variable collection and mode combination.
 * Token files are named using the pattern: `{collectionName}.{modeName}.json`.
 *
 * @param localVariablesResponse - The response from Figma's GET local variables API
 * @returns An object mapping file names to their token file contents
 */
export function tokenFilesFromLocalVariables(localVariablesResponse: GetLocalVariablesResponse) {
  const tokenFiles: { [fileName: string]: TokensFile } = {};
  const localVariableCollections = localVariablesResponse.meta.variableCollections;
  const localVariables = localVariablesResponse.meta.variables;

  Object.values(localVariables).forEach((variable) => {
    // Skip remote variables because we only want to generate tokens for local variables
    if (variable.remote) {
      return;
    }

    const collection = localVariableCollections[variable.variableCollectionId];

    collection.modes.forEach((mode) => {
      const fileName = `${collection.name}.${mode.name}.json`;

      if (!tokenFiles[fileName]) {
        tokenFiles[fileName] = {};
      }

      let obj: any = tokenFiles[fileName];

      variable.name.split('/').forEach((groupName) => {
        obj[groupName] = obj[groupName] || {};
        obj = obj[groupName];
      });

      const token: Token = {
        $type: tokenTypeFromVariable(variable),
        $value: tokenValueFromVariable(variable, mode.modeId, localVariables),
        $description: variable.description,
        $extensions: {
          'com.figma': {
            hiddenFromPublishing: variable.hiddenFromPublishing,
            scopes: variable.scopes,
            codeSyntax: variable.codeSyntax,
          },
        },
      };

      Object.assign(obj, token);
    });
  });

  return tokenFiles;
}
