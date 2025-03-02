import React from 'react';
import { useHistory } from 'react-router';
import { useAppContext } from '../AppContext';
import { handleLoadQuizData } from './handleLoadQuizData';
import { QuizState } from './useQuizState';
import { join } from '@tauri-apps/api/path';
import { exists } from '@tauri-apps/plugin-fs';
import { ask } from '@tauri-apps/plugin-dialog';

export const useLoadQuizData = () => {
  const { quizInitialReps, dispatchQuizState } = useAppContext();
  const history = useHistory();

  return React.useCallback(async (path: string) => {
    let loadProgress = false;
    const saveJSONPath = await join(path, 'save.json');
    if (await exists(saveJSONPath)) {
      loadProgress = await ask('Wczytać postęp?', {
        kind: 'info',
      });
    }

    console.time('loading quiz'); // timing quiz load
    handleLoadQuizData({ loadProgress, quizInitialReps }, path).then(
      (quizData) => {
        console.timeEnd('loading quiz'); // timing quiz load
        console.log(quizData); // show loaded quiz
        dispatchQuizState({
          type: 'SET_STATE',
          payload: quizData as QuizState,
        });

        history.push('/quiz');
      }
    );
  }, []);
};
