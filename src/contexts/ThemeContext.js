import React, { createContext, useCallback, useMemo, useState } from "react";
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import {
  PaperProvider,
  MD3LightTheme as PaperDefaultTheme,
  MD3DarkTheme as PaperDarkTheme,
} from "react-native-paper";
import { navigationRef } from "utils/RootNavigation";


const DefaultTheme = {
  ...NavigationDefaultTheme,
  ...PaperDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: "rgb(18, 83, 214)",
    onPrimary: "rgb(255, 255, 253)",
    primaryContainer: "rgb(227, 234, 255)",
    onPrimaryContainer: "rgb(0, 23, 76)",
    secondary: "rgb(89, 94, 114)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(221, 225, 249)",
    onSecondaryContainer: "rgb(22, 27, 44)",
    tertiary: "rgb(116, 84, 112)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(255, 214, 247)",
    onTertiaryContainer: "rgb(43, 18, 42)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(255, 255, 255)",
    onBackground: "rgb(51,51,51)",
    surface: "rgb(255, 255, 255)",
    onSurface: "rgb(51,51,51)",
    surfaceVariant: "rgb(226, 226, 236)",
    onSurfaceVariant: "rgb(118,118,118)",
    outline: "rgb(241, 241, 241)",
    outlineVariant: "rgb(197, 198, 208)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(48, 48, 52)",
    inverseOnSurface: "rgb(242, 240, 244)",
    inversePrimary: "rgb(180, 197, 255)",
    elevation: {
      level0: "transparent",
      level1: "rgb(242, 243, 253)",
      level2: "rgb(235, 238, 252)",
      level3: "rgb(228, 233, 251)",
      level4: "rgb(226, 231, 250)",
      level5: "rgb(221, 228, 249)",
    },
    surfaceDisabled: "rgba(27, 27, 31, 0.12)",
    onSurfaceDisabled: "rgba(27, 27, 31, 0.38)",
    backdrop: "rgba(46, 48, 56, 0.4)",
    //Addons Theme
    accept: "rgb(35, 93, 58)",
    acceptContainer: "rgb(200, 234, 209)",
    warning: "rgb(255, 163, 48)",
    warningContainer: "rgb(255, 252, 206)"
  },
};

const DarkTheme = {
  ...NavigationDarkTheme,
  ...PaperDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    ...PaperDarkTheme.colors,
  },
};

export const ThemeContext = createContext({
  toggleTheme: () => {},
  isDarkTheme: false,
});

export const ThemeContextProvider = ({ children }) => {

  //Default Theme
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const theme = isDarkTheme ? DarkTheme : DefaultTheme;

  const toggleTheme = useCallback(() => {
    return setIsDarkTheme(!isDarkTheme);
  }, [isDarkTheme]);

  const preferences = useMemo(
    () => ({
      toggleTheme,
      isDarkTheme,
    }),
    [toggleTheme, isDarkTheme]
  );

  return (
    <ThemeContext.Provider value={preferences}>
      <PaperProvider theme={theme}>
        <NavigationContainer
          ref={navigationRef}
          theme={theme}
        >
          {children}
        </NavigationContainer>
      </PaperProvider>
    </ThemeContext.Provider>
  );
};
