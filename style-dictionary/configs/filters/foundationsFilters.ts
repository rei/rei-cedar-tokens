import { foundatiosMoudulesName } from './modules';

export const foundationsFilters = (extension: string, format: string) => {
  const filtersObject = foundatiosMoudulesName.map((moduleName) => ({
    destination: `../../web/default/${extension}/foundations/${moduleName}.${extension}`,
    format: format,
    filter: `foundations-${moduleName}-tokens`,
  }));

  return filtersObject;
};
