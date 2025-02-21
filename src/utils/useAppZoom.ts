import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';

export type Zoom = number;

export const useAppZoom = () => {
  const [zoom, setZoom] = useLocalStorage<Zoom>('zoom', 1);
  useEffect(() => {
    document.documentElement.style.zoom = `${100 * zoom}%`;
  }, [zoom]);

  return { zoom, setZoom };
};
