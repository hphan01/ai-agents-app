import { useEffect, useState } from 'react';

export type ColorScheme = 'light' | 'dark';

const STORAGE_KEY = 'daymark-color-scheme';
const THEME_COLORS: Record<ColorScheme, string> = {
  light: '#f6f3ee',
  dark: '#17191a',
};

function getInitialScheme(): ColorScheme {
  try {
    const storedScheme = window.localStorage.getItem(STORAGE_KEY);
    return storedScheme === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function useColorScheme() {
  const [scheme, setScheme] = useState<ColorScheme>(getInitialScheme);

  useEffect(() => {
    document.documentElement.dataset.theme = scheme;
    document.getElementById('theme-color')?.setAttribute('content', THEME_COLORS[scheme]);
    try {
      window.localStorage.setItem(STORAGE_KEY, scheme);
    } catch {
      // The in-memory color scheme remains usable when storage is unavailable.
    }
  }, [scheme]);

  function toggleScheme() {
    setScheme(currentScheme => currentScheme === 'light' ? 'dark' : 'light');
  }

  return { scheme, toggleScheme };
}
