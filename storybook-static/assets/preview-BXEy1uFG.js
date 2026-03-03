const e = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    backgrounds: {
      default: "cedar-light",
      values: [
        { name: "cedar-light", value: "#fafbf9" },
        { name: "cedar-secondary", value: "#f7f5f3" },
        { name: "cedar-dark", value: "#2e2e2b" },
        { name: "white", value: "#ffffff" },
      ],
    },
  },
};
export { e as default };
