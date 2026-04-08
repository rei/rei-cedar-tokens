export const componentsFilters = (extension: string, format: string) => {
  const modulesName = [
    "accordion",
    "button",
    "chip",
    "form",
    "icon",
    "input",
    "link",
    "message",
    "modal",
    "pagination",
    "rating",
    "slide",
    "surface-selection",
    "surface",
    "switch",
    "tab",
    "table",
    "toggle-button",
    "tooltip",
  ];
  const filtersObject = modulesName.map((moduleName) => ({
    destination: `../../web/default/${extension}/components/${moduleName}.${extension}`,
    format: format,
    filter: `component-${moduleName}-tokens`,
  }));

  return filtersObject;
};
