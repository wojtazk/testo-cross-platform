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

  // FIXME:
  console.log(action);

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
      return {
        saveJSON: {
          ...state.saveJSON,
          numberOfBadAnswers: action.payload.numberOfBadAnswers,
          numberOfCorrectAnswers: action.payload.numberOfCorrectAnswers,
          numberOfLearnedQuestions: action.payload.numberOfLearnedQuestions,
          time: action.payload.time,
        },
        questions: state.questions.filter((q) => q.reoccurrences > 0),
        currentQuestionIndex: Math.floor(
          Math.random() * (state.questions.length - 1)
        ),
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
