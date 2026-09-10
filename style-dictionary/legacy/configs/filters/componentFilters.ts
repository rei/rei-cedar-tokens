import { componentModulesName } from './modules';

export const componentFilters = (extension: string, format: string) => {
  const filtersObject = componentModulesName.map((moduleName) => ({
    destination: `./components/cdr-${moduleName}.${extension}`,
    format,
    filter: `component-${moduleName}-tokens`,
  }));

  return filtersObject;
};
