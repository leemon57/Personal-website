"use client";

import { useEffect, useState } from "react";

/**
 * ThemeToggle
 *
 * Applies the uploaded prototype's light/dark toggle by mutating the root
 * document theme attribute and persisting the choice in localStorage.
 *
 * Used by: components/Nav.tsx
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    setTheme(current);
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
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="theme-toggle"
      onClick={toggleTheme}
      title={isDark ? "Light mode" : "Dark mode"}
      type="button"
    >
      <span aria-hidden="true" className="glyph">
        {isDark ? "☀" : "☾"}
      </span>
    </button>
  );
}
