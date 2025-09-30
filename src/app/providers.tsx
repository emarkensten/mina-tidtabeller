"use client";

import { ReactNode } from "react";
import ThemeProvider from "@sj-ab/component-library.ui.theme-provider";
import { lightTheme } from "@sj-ab/component-library.styles.themes";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider theme={lightTheme}>
      {children}
    </ThemeProvider>
  );
}
