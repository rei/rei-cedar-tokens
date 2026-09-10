import { foundationsModulesName, EXCLUDED_MODULES } from './modules';

export const foundationsFilters = (extension: string, format: string) => {
  const filtersObject = foundationsModulesName
    .filter((moduleName) => !EXCLUDED_MODULES.includes(moduleName))
    .map((moduleName) => ({
      destination: `./foundations/cdr-${moduleName}.${extension}`,
      format: format,
      filter: `foundations-${moduleName}-tokens`,
    }));

  return filtersObject;
};
