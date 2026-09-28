import { foundationsModulesName, EXCLUDED_MODULES } from './modules';

export const foundationsFilters = (
  extension: string,
  format: string,
  moduleNames: string[] = foundationsModulesName,
  excluded: string[] = EXCLUDED_MODULES,
) => {
  const filtersObject = moduleNames
    .filter((moduleName) => !excluded.includes(moduleName))
    .map((moduleName) => ({
      destination: `./foundations/cdr-${moduleName}.${extension}`,
      format: format,
      filter: `foundations-${moduleName}-tokens`,
    }));

  return filtersObject;
};
