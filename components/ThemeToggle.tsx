"use client";

import { useEffect, useState } from "react";

/**
 * ThemeToggle
 *
 * Day / night switch for the farm skin. Mutates the root document theme
 * attribute and persists the choice in localStorage. Shows a sun while at
 * night (tap for day) and a moon while in day (tap for night).
 *
 * Used by: components/Nav.tsx
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const read = () =>
      setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    read();
    // Stay in sync when the theme is toggled elsewhere (e.g. the command menu).
    window.addEventListener("hj:theme-change", read);
    return () => window.removeEventListener("hj:theme-change", read);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("hj-theme", next);
    setTheme(next);
  }

  const isDark = theme === "dark";

  return (
    <button
      aria-label={isDark ? "Switch to day" : "Switch to night"}
      className="theme-toggle"
      onClick={toggleTheme}
      title={isDark ? "Day" : "Night"}
      type="button"
    >
      <span aria-hidden="true" className="glyph">
        {isDark ? "☀" : "☾"}
      </span>
    </button>
  );
}
