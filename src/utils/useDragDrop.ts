import { getCurrentWebview } from '@tauri-apps/api/webview';
import { useEffect, useState } from 'react';

export const useDragDrop = () => {
  // if user is dragging over an element
  const [draggingOver, setDraggingOver] = useState<boolean>(false);
  const [draggedPath, setDraggedPath] = useState<string>('');

  useEffect(() => {
    const unlistenPromise = getCurrentWebview().onDragDropEvent((event) => {
      // allow drag and drop only on initial app view
      if (location.pathname !== '/') return;

      if (event.payload.type === 'over') {
        setDraggingOver(true);
      } else if (event.payload.type === 'drop') {
        setDraggedPath(event.payload.paths[0]);
        setDraggingOver(false);
      } else {
        setDraggedPath('');
        setDraggingOver(false);
      }
    });

    return () => {
      unlistenPromise.then((unlisten) => unlisten());
    };
  }, []);

  return { draggingOver, draggedPath };
};
