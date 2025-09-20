"use client"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

function ThemeProviderComponent({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export { ThemeProviderComponent as ThemeProvider }
