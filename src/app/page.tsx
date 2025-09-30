"use client";

import { useState } from "react";
import FlowButton from "@sj-ab/component-library.ui.flow-button";
import Typography from "@sj-ab/component-library.ui.typography";
import Box from "@mui/material/Box";
import Stack from "@sj-ab/component-library.ui.stack";
import { lightTheme, darkTheme } from "@sj-ab/component-library.styles.themes";
import ThemeProvider from "@sj-ab/component-library.ui.theme-provider";

export default function ThemePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  const handleLightMode = () => {
    setIsDarkMode(false);
  };

  const handleDarkMode = () => {
    setIsDarkMode(true);
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <Box component="div" sx={(theme) => ({ 
        minHeight: '100dvh', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.designTokens.color.background.base.primary.value,
        color: theme.designTokens.color.label.primary.value,
      })}>
        <Stack spacing={4} alignItems="center">
          <Typography variant="h1" marginBottom={2}>
            Hej hej! 👋
          </Typography>
          <Stack direction="row" spacing={3}>
            <FlowButton onClick={handleLightMode}>
              Light mode
            </FlowButton>
            <FlowButton onClick={handleDarkMode}>
              Dark mode
            </FlowButton>
          </Stack>
        </Stack>
      </Box>
    </ThemeProvider>
  );
}
