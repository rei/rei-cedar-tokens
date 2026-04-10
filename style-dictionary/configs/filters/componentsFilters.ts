import { componentModulesName } from "./modules";

export const componentsFilters = (extension: string, format: string) => {
  const filtersObject = componentModulesName.map((moduleName) => ({
    destination: `../../web/default/${extension}/components/${moduleName}.${extension}`,
    format: format,
    filter: `component-${moduleName}-tokens`,
  }));

  return filtersObject;
};
