export const foundationsFilters = (extension: string, format: string) => {
  const modulesName = [
    "color-background",
    "color-border",
    "color-text",
    "motion",
    "prominence",
    "radius",
    "space",
  ];
  const filtersObject = modulesName.map((moduleName) => ({
    destination: `../../web/default/${extension}/foundations/${moduleName}.${extension}`,
    format: format,
    filter: `foundations-${moduleName}-tokens`,
  }));

  return filtersObject;
};
