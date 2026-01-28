import { useEffect } from "react";

export function useSystemTheme() {
  useEffect(() => {
    const applyTheme = (isDark) => {
      document.body.setAttribute("data-theme", isDark ? "dark" : "light");
    };

    // ✅ Detect the current system theme
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    applyTheme(mediaQuery.matches);

    // ✅ Listen for system theme changes (auto update)
    const listener = (event) => applyTheme(event.matches);
    mediaQuery.addEventListener("change", listener);

    // ✅ Cleanup listener on unmount
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);
}
