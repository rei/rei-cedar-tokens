export const CdrIntents = {
  Primary: {
    surface: "#ffffff",
    text: "#4c473e",
    icon: "#4c473e",
    border: "#cecac3",
    textEmphasis: "#312d27",
  },
  Secondary: {
    surface: "#f8f7f2",
    text: "#746e63",
    icon: "#746e63",
    border: "#979187",
  },
  Brand: {
    surface: "#143528",
    text: "#ffffff",
    icon: "#ffffff",
    border: "#e5fd9c",
  },
  Link: {
    text: {
      rest: "#3d6db9",
      active: "#5889d6",
      visited: "#1e4683",
    },
    border: {
      hover: "#3d6db9",
      active: "#5889d6",
    },
  },
};

export const CdrIntentOrder = [
  "Primary",
  "Secondary",
  "Brand",
  "Link",
];

export default CdrIntents;
