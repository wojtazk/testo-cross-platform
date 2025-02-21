import { getCurrentWebview } from '@tauri-apps/api/webview';
import { useEffect, useState } from 'react';

export const useDirectoryDragDrop = (
  handleDirectoryDragDrop: (paths: string[]) => void
) => {
  // if user is dragging over an element
  const [draggingOver, setDraggingOver] = useState<boolean>(false);

  useEffect(() => {
    const unlistenPromise = getCurrentWebview().onDragDropEvent((event) => {
      if (event.payload.type === 'over') {
        setDraggingOver(true);
      } else if (event.payload.type === 'drop') {
        handleDirectoryDragDrop(event.payload.paths);
        setDraggingOver(false);
      } else {
        setDraggingOver(false);
      }
    });

    return () => {
      unlistenPromise.then((unlisten) => unlisten());
    };
  }, []);

  return { draggingOver };
};
