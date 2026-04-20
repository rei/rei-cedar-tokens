import { foundatiosMoudulesName, componentModulesName } from './modules';

export const typesFilters = (rootFolder: string) => {
  const filtersFoundations = foundatiosMoudulesName.flatMap((moduleName) => [
    {
      destination: `../../web/default/${rootFolder}/foundations/${moduleName}.mjs`,
      format: 'typescript/module-values',
      filter: `foundations-${moduleName}-tokens`,
    },
    {
      destination: `../../web/default/${rootFolder}/foundations/${moduleName}.d.ts`,
      format: 'typescript/module-interface',
      filter: `foundations-${moduleName}-tokens`,
    },
    {
      destination: `../../web/default/${rootFolder}/foundations/${moduleName}.names.d.ts`,
      format: 'typescript/token-name-union',
      filter: `foundations-${moduleName}-tokens`,
    },
  ]);

  const filtersComponent = componentModulesName.flatMap((moduleName) => [
    {
      destination: `../../web/default/${rootFolder}/components/${moduleName}.mjs`,
      format: 'typescript/module-values',
      filter: `component-${moduleName}-tokens`,
    },
    {
      destination: `../../web/default/${rootFolder}/components/${moduleName}.d.ts`,
      format: 'typescript/module-interface',
      filter: `component-${moduleName}-tokens`,
    },
    {
      destination: `../../web/default/${rootFolder}/components/${moduleName}.names.d.ts`,
      format: 'typescript/token-name-union',
      filter: `component-${moduleName}-tokens`,
    },
  ]);

  return filtersFoundations.concat(filtersComponent);
};
