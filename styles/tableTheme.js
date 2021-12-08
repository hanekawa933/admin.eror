import { createTheme } from "react-data-table-component";

// createTheme creates a new theme named solarized that overrides the build in dark theme
export const lightTheme = createTheme("light", {
  background: {
    default: "transparent",
  },
});

export const darkTheme = createTheme("dark", {
  background: {
    default: "transparent",
  },
});
