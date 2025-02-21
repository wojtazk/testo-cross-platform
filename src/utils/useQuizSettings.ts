import { useLocalStorage } from 'usehooks-ts';

export type QuizReps = number;

export const useQuizSettings = () => {
  const [quizInitialReps, setQuizInitialReps] = useLocalStorage<QuizReps>(
    'quiz-initial-reps',
    2
  );
  const [quizWrongAnswerExtraReps, setQuizWrongAnswerExtraReps] =
    useLocalStorage<QuizReps>('quiz-wrong-answer-extra-reps', 1);
  const [quizMaxReps, setQuizMaxReps] = useLocalStorage<QuizReps>(
    'quiz-max-reps',
    6
  );

  return {
    quizInitialReps,
    setQuizInitialReps,
    quizWrongAnswerExtraReps,
    setQuizWrongAnswerExtraReps,
    quizMaxReps,
    setQuizMaxReps,
  };
};
