import { useCallback } from 'react';
import { useLocalStorage } from 'usehooks-ts';

export const useRecentyUsed = () => {
  const [recentlyUsed, setRecentlyUsed] = useLocalStorage<string[]>(
    'recently-used',
    []
  );

  const addRecentlyUsed = useCallback((location: string) => {
    setRecentlyUsed((prevRecentlyUsed) => {
      // max 5 recently used, no duplicates
      return [
        location,
        ...prevRecentlyUsed.filter((entry) => entry !== location),
      ].slice(0, 5);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { recentlyUsed, addRecentlyUsed };
};
