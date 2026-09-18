import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("aerobook_theme") || "light",
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("aerobook_theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
      aria-label="Toggle dark mode"
      className="h-8 w-8 flex items-center justify-center rounded-full border border-slate-300 hover:bg-paper-100 text-ink-600 text-sm"
    >
      {theme === "light" ? "🌙" : "☀"}
    </button>
  );
}
