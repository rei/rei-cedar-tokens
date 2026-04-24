import { foundatiosMoudulesName, componentModulesName } from './modules';

export const typesFilters = () => {
  const filtersFoundations = foundatiosMoudulesName.flatMap((moduleName) => [
    {
      destination: `./foundations/${moduleName}.mjs`,
      format: 'typescript/module-values',
      filter: `foundations-${moduleName}-tokens`,
    },
    {
      destination: `./foundations/${moduleName}.d.ts`,
      format: 'typescript/module-interface',
      filter: `foundations-${moduleName}-tokens`,
    },
    {
      destination: `./foundations/${moduleName}.names.d.ts`,
      format: 'typescript/token-name-union',
      filter: `foundations-${moduleName}-tokens`,
    },
  ]);

  const filtersComponent = componentModulesName.flatMap((moduleName) => [
    {
      destination: `./components/${moduleName}.mjs`,
      format: 'typescript/module-values',
      filter: `component-${moduleName}-tokens`,
    },
    {
      destination: `./components/${moduleName}.d.ts`,
      format: 'typescript/module-interface',
      filter: `component-${moduleName}-tokens`,
    },
    {
      destination: `./components/${moduleName}.names.d.ts`,
      format: 'typescript/token-name-union',
      filter: `component-${moduleName}-tokens`,
    },
  ]);

  return filtersFoundations.concat(filtersComponent);
};
