import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';

export type FontSize = number;

export const useAppFontSize = () => {
  const [fontSize, setFontSize] = useLocalStorage<FontSize>('fontsize', 1);
  useEffect(() => {
    document.documentElement.style.fontSize = `${100 * fontSize}%`;
  }, [fontSize]);

  return { fontSize, setFontSize };
};
