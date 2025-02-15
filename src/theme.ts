import React from "react";
import { createTheme, Theme } from "@mui/material/styles";
import { deepPurple } from "@mui/material/colors";
import useMediaQuery from "@mui/material/useMediaQuery";

// Создадим 2 варианта темы: светлую и тёмную
const getDesignTokens = (mode: "light" | "dark"): Theme => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: deepPurple[400],
      },
      secondary: {
        main: deepPurple[200],
      },
      background: {
        default: mode === "light" ? "#f5f5f5" : "#121212",
        paper: mode === "light" ? "#ffffff" : "#1e1e1e",
      },
    },
    // Доп. стили, если нужно
  });
};

// Хук, который управляет темой (тёмная/светлая)
export function useColorMode() {
  // Можно проверять prefers-color-scheme, если хотим
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [mode, setMode] = React.useState<"light" | "dark">(
    prefersDarkMode ? "dark" : "light"
  );

  // Создаём MUI-тему
  const theme = React.useMemo(() => getDesignTokens(mode), [mode]);

  const toggleColorMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { mode, theme, toggleColorMode };
}
