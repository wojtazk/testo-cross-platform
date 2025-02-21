import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { toggleIonDarkPalette } from './toggleIonDarkPalette';

export type Theme = 'light' | 'dark' | undefined;
export type UIMode = 'ios' | 'md' | undefined;

export const useThemeAndUIStyle = () => {
  const [theme, setTheme, removeTheme] = useLocalStorage<Theme>(
    'theme',
    undefined
  );
  const [UIMode, setUIMode, removeUIMode] = useLocalStorage<UIMode>(
    'ui-mode',
    undefined
  );
  useEffect(() => {
    // follow the system theme
    if (theme !== undefined) return;

    // Use matchMedia to check the user preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    toggleIonDarkPalette(prefersDark.matches);

    const setDarkPaletteFromMediaQuery = (mediaQuery: MediaQueryListEvent) => {
      toggleIonDarkPalette(mediaQuery.matches);
    };
    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addEventListener('change', setDarkPaletteFromMediaQuery);

    return () => {
      prefersDark.removeEventListener('change', setDarkPaletteFromMediaQuery);
    };
  }, [theme]);

  return { theme, setTheme, removeTheme, UIMode, setUIMode, removeUIMode };
};
