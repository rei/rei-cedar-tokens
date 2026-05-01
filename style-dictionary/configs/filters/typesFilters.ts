import { foundationsModulesName, componentModulesName } from './modules';

export const typesFilters = () => {
  const filtersFoundations = foundationsModulesName.flatMap((moduleName) => [
    {
      destination: `./foundations/cdr-${moduleName}.mjs`,
      format: 'typescript/module-values',
      filter: `foundations-${moduleName}-tokens`,
    },
    {
      destination: `./foundations/cdr-${moduleName}.d.ts`,
      format: 'typescript/module-interface',
      filter: `foundations-${moduleName}-tokens`,
    },
    {
      destination: `./foundations/cdr-${moduleName}.names.d.ts`,
      format: 'typescript/token-name-union',
      filter: `foundations-${moduleName}-tokens`,
    },
  ]);

  const filtersComponent = componentModulesName.flatMap((moduleName) => [
    {
      destination: `./components/cdr-${moduleName}.mjs`,
      format: 'typescript/module-values',
      filter: `component-${moduleName}-tokens`,
    },
    {
      destination: `./components/cdr-${moduleName}.d.ts`,
      format: 'typescript/module-interface',
      filter: `component-${moduleName}-tokens`,
    },
    {
      destination: `./components/cdr-${moduleName}.names.d.ts`,
      format: 'typescript/token-name-union',
      filter: `component-${moduleName}-tokens`,
    },
  ]);

  return filtersFoundations.concat(filtersComponent);
};
