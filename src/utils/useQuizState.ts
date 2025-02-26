import { useReducer } from 'react';

import { Image, SaveJSONType } from './handleLoadQuizData';
import { Question } from './parseQuizQuestion';

export type QuizState = {
  saveJSON: SaveJSONType;
  questions: Question[];
  currentQuestionIndex: number;
  images: Image[];
};

export type QuizStateDispatchAction =
  | { type: 'SET_STATE'; payload: QuizState }
  | { type: 'UPDATE_TIMER'; payload: number }
  | {
      type: 'UPDATE_STATE';
    };

const reducer = (
  state: QuizState,
  action: QuizStateDispatchAction
): QuizState => {
  switch (action.type) {
    case 'SET_STATE':
      return {
        ...action.payload,
        currentQuestionIndex: Math.floor(
          Math.random() * action.payload.questions.length
        ),
      };
    case 'UPDATE_TIMER': // FIXME: bye bye
      state.saveJSON.time = action.payload;
      return { ...state };
    case 'UPDATE_STATE':
      const newQuestions = state.questions.filter((q) => q.reoccurrences > 0);
      return {
        saveJSON: state.saveJSON,
        questions: newQuestions,
        currentQuestionIndex: Math.floor(Math.random() * newQuestions.length),
        images: state.images,
      };
    default:
      return state;
  }
};

const initialState: QuizState = {
  saveJSON: {
    location: '',
    numberOfQuestions: NaN,
    numberOfBadAnswers: NaN,
    numberOfCorrectAnswers: NaN,
    numberOfLearnedQuestions: NaN,
    time: NaN,
    reoccurrences: [],
  },
  questions: [],
  currentQuestionIndex: NaN,
  images: [],
};
export const useQuizState = () => {
  const [quizState, dispatchQuizState] = useReducer(reducer, initialState);

  return { quizState, dispatchQuizState };
};
