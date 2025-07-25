/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    secondaryText: "#687076",
    background: "#fff",
    secondaryBg: "#dddddd",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    border: "#D1D1D6",
    secondaryBorder: "#E5E5EA",
    danger: "#DC2525",
  },
  dark: {
    text: "#ECEDEE",
    secondaryText: "#9BA1A6",
    background: "#121212",
    secondaryBg: "#212529",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    border: "#434B52",
    secondaryBorder: "#2C3238",
    danger: "#DC2525",
  },
};
