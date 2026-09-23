import { GetLocalVariablesResponse, LocalVariable, RGBA } from '@figma/rest-api-spec';
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
/**
 * Resolves a Figma color value to an RGBA object.
 *
 * Supports plain RGB(A) objects, color overrides that combine a `color` reference
 * with an `opacity` percentage, and chains of variable aliases.
 */
function resolveColorValue(
  value: unknown,
  modeId: string,
  modeName: string,
  localVariables: { [id: string]: LocalVariable },
  localVariableCollections: {
    [id: string]: {
      name: string;
      defaultModeId?: string;
      modes: { modeId: string; name: string }[];
    };
  },
  seen = new Set<string>(),
): RGBA {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`Expected color object, got ${JSON.stringify(value)}`);
  }

  const obj = value as Record<string, unknown>;

  if (obj.type === 'VARIABLE_ALIAS' && typeof obj.id === 'string') {
    const id = obj.id;
    if (seen.has(id)) {
      throw new Error(`Circular color alias detected: ${id}`);
    }
    const aliasedVariable = localVariables[id];
    if (!aliasedVariable) {
      throw new Error(`Color alias references unknown variable: ${id}`);
    }
    const aliasedCollection = localVariableCollections[aliasedVariable.variableCollectionId];
    if (!aliasedCollection) {
      throw new Error(
        `Color alias ${id} -> "${aliasedVariable.name}" does not belong to a known collection`,
      );
    }
    let targetMode = aliasedCollection.modes.find((m) => m.name === modeName);
    if (!targetMode) {
      const defaultMode = aliasedCollection.defaultModeId
        ? aliasedCollection.modes.find((m) => m.modeId === aliasedCollection.defaultModeId)
        : undefined;
      targetMode = defaultMode ?? aliasedCollection.modes[0];
    }
    if (!targetMode) {
      throw new Error(
        `Color alias ${id} -> "${aliasedVariable.name}" has no mode named "${modeName}" in collection "${aliasedCollection.name}"`,
      );
    }
    const aliasedValue = aliasedVariable.valuesByMode[targetMode.modeId];
    if (aliasedValue === undefined) {
      throw new Error(
        `Color alias ${id} -> "${aliasedVariable.name}" has no value for mode "${modeName}" (${targetMode.modeId})`,
      );
    }
    return resolveColorValue(
      aliasedValue,
      targetMode.modeId,
      modeName,
      localVariables,
      localVariableCollections,
      new Set([...seen, id]),
    );
  }

  if ('color' in obj) {
    const color = obj.color as unknown;
    const opacityPercent = typeof obj.opacity === 'number' ? obj.opacity : 100;
    const baseColor = resolveColorValue(
      color,
      modeId,
      modeName,
      localVariables,
      localVariableCollections,
      seen,
    );
    return {
      ...baseColor,
      a: baseColor.a * (opacityPercent / 100),
    };
  }

  if ('r' in obj && 'g' in obj && 'b' in obj) {
    const color = obj as Record<string, number>;
    return {
      r: color.r,
      g: color.g,
      b: color.b,
      a: 'a' in color && typeof color.a === 'number' ? color.a : 1,
    };
  }

  throw new Error(`Invalid color value format: ${JSON.stringify(value)}`);
}

function tokenValueFromVariable(
  variable: LocalVariable,
  modeId: string,
  modeName: string,
  localVariables: { [id: string]: LocalVariable },
  localVariableCollections: {
    [id: string]: {
      name: string;
      defaultModeId?: string;
      modes: { modeId: string; name: string }[];
    };
  },
): string | number | boolean {
  const value = variable.valuesByMode[modeId];

  if (value === null) {
    throw new Error(`[mode ${modeId}] Variable "${variable.name}" has a null value`);
  }

  if (typeof value !== 'object') {
    return value;
  }

  const obj = value as Record<string, unknown>;

  if (obj.type === 'VARIABLE_ALIAS' && typeof obj.id === 'string') {
    const aliasedVariable = localVariables[obj.id];
    if (!aliasedVariable) {
      throw new Error(`Alias "${variable.name}" references unknown variable ${obj.id}`);
    }
    return `{${aliasedVariable.name.replace(/\//g, '.')}}`;
  }

  if ('r' in obj || 'color' in obj) {
    return rgbToHex(
      resolveColorValue(value, modeId, modeName, localVariables, localVariableCollections),
    );
  }

  throw new Error(
    `[mode ${modeId}] Invalid value for variable "${variable.name}": ${JSON.stringify(value)} (resolvedType: ${variable.resolvedType})`,
  );
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
        $value: tokenValueFromVariable(
          variable,
          mode.modeId,
          mode.name,
          localVariables,
          localVariableCollections,
        ),
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
