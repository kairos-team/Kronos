const STORAGE_KEY = "kronos-theme";

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeTheme(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getThemeSnapshot(): boolean {
  return document.documentElement.classList.contains("dark");
}

export function getThemeServerSnapshot(): boolean {
  return false;
}

export function setDarkMode(next: boolean) {
  document.documentElement.classList.toggle("dark", next);
  try {
    localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
  } catch {}
  listeners.forEach((listener) => listener());
}
