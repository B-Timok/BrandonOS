"use client";

import { useEffect, useState } from "react";

/**
 * Lets the user flip the entire dashboard between the classic Windows 98 look
 * and a neo-brutalism (RetroUI-style) look for comparison. The choice is stored
 * in localStorage and applied as a `data-theme` attribute on <html>, which the
 * theme stylesheets in globals.css key off of.
 */
const THEMES = [
  { id: "classic", label: "Classic 98" },
  { id: "neo", label: "Neo-Brutalism" },
] as const;

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<string>("classic");

  // Sync to whatever the no-flash init script already applied.
  useEffect(() => {
    const current =
      document.documentElement.getAttribute("data-theme") || "classic";
    setTheme(current);
  }, []);

  function apply(next: string) {
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("brandonos-theme", next);
    } catch {
      // ignore (e.g. storage disabled)
    }
  }

  return (
    <label className="theme-switcher">
      <span>Theme:</span>
      <select value={theme} onChange={(e) => apply(e.target.value)}>
        {THEMES.map((t) => (
          <option key={t.id} value={t.id}>
            {t.label}
          </option>
        ))}
      </select>
    </label>
  );
}
