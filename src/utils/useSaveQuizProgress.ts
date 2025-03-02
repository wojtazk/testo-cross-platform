import React from 'react';
import { useAppContext } from '../AppContext';
import { SaveJSONType } from './handleLoadQuizData';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import { message } from '@tauri-apps/plugin-dialog';

export const useSaveQuizProgress = () => {
  const { quizState } = useAppContext();

  return React.useCallback(async () => {
    const save: SaveJSONType = {
      ...quizState.saveJSON,
      reoccurrences: [
        ...quizState.saveJSON.reoccurrences,
        ...quizState.questions.map((q) => {
          return { tag: q.tag, value: q.reoccurrences };
        }),
      ],
    };

    await writeTextFile(`${save.location}/save.json`, JSON.stringify(save));

    await message('Zapisano stan', { kind: 'info' });
  }, [quizState]);
};
