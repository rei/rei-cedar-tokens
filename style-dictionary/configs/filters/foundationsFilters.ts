import { foundationsModulesName } from './modules';

export const foundationsFilters = (extension: string, format: string) => {
  const filtersObject = foundationsModulesName.map((moduleName) => ({
    destination: `./foundations/cdr-${moduleName}.${extension}`,
    format: format,
    filter: `foundations-${moduleName}-tokens`,
  }));

  return filtersObject;
};
