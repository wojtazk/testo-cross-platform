import { useReducer } from 'react';

import { Image, SaveJSONType } from './handleLoadQuizData';
import { Question } from './parseQuizQuestion';

export type QuizState = {
  saveJSON: SaveJSONType;
  questions: Question[];
  images: Image[];
};

export type QuizStateDispatchAction =
  | { type: 'SET_STATE'; payload: QuizState }
  | {
      type: 'UPDATE_STATE';
      payload: {
        numberOfBadAnswers: number;
        numberOfCorrectAnswers: number;
        numberOfLearnedQuestions: number;
        time: number;
        questionIndex: number;
      };
    };

// FIXME: removing question items if reoccurrences == 0
const reducer = (
  state: QuizState,
  action: QuizStateDispatchAction
): QuizState => {
  if (action.payload === undefined) return state;

  switch (action.type) {
    case 'SET_STATE':
      return { ...action.payload };
    case 'UPDATE_STATE':
      return {
        saveJSON: {
          ...state.saveJSON,
          numberOfBadAnswers: action.payload.numberOfBadAnswers,
          numberOfCorrectAnswers: action.payload.numberOfCorrectAnswers,
          numberOfLearnedQuestions: action.payload.numberOfLearnedQuestions,
          time: action.payload.time,
        },
        questions: [
          ...state.questions.slice(0, action.payload.questionIndex),
          { ...state.questions[action.payload.questionIndex] },
          ...state.questions.slice(action.payload.questionIndex + 1),
        ],
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
  images: [],
};
export const useQuizState = () => {
  const [quizState, dispatchQuizState] = useReducer(reducer, initialState);

  return { quizState, dispatchQuizState };
};
