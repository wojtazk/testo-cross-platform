import { createContext, useContext } from 'react';

import { useQuizSettings } from './utils/useQuizSettings';
import { useThemeAndUIStyle } from './utils/useThemeAndUIStyle';
import { toggleIonDarkPalette } from './utils/toggleIonDarkPalette';
import { useAppZoom } from './utils/useAppZoom';
import { useAppFontSize } from './utils/useAppFontSize';

// types
import { QuizReps } from './utils/useQuizSettings';
import { Theme, UIMode } from './utils/useThemeAndUIStyle';
import { Zoom } from './utils/useAppZoom';
import { FontSize } from './utils/useAppFontSize';

// app context types
export type AppContextValues = {
  quizInitialReps: number;
  setQuizInitialReps: React.Dispatch<React.SetStateAction<QuizReps>>;
  quizWrongAnswerExtraReps: QuizReps;
  setQuizWrongAnswerExtraReps: React.Dispatch<React.SetStateAction<QuizReps>>;
  quizMaxReps?: QuizReps;
  setQuizMaxReps: React.Dispatch<React.SetStateAction<QuizReps>>;
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  removeTheme: () => void;
  toggleIonDarkPalette: (shouldAdd: boolean) => void;
  UIMode: UIMode;
  setUIMode: React.Dispatch<React.SetStateAction<UIMode>>;
  removeUIMode: () => void;
  zoom: Zoom;
  setZoom: React.Dispatch<React.SetStateAction<Zoom>>;
  fontSize: FontSize;
  setFontSize: React.Dispatch<React.SetStateAction<FontSize>>;
};

// context
const AppContext = createContext<AppContextValues>({} as AppContextValues);

// context provider
export const AppContextProvider = ({ children }: React.PropsWithChildren) => {
  // quiz settings
  const {
    quizInitialReps,
    setQuizInitialReps,
    quizWrongAnswerExtraReps,
    setQuizWrongAnswerExtraReps,
    quizMaxReps,
    setQuizMaxReps,
  } = useQuizSettings();

  // theme and ui style
  const { theme, setTheme, removeTheme, UIMode, setUIMode, removeUIMode } =
    useThemeAndUIStyle();

  // app zoom (scaling)
  const { zoom, setZoom } = useAppZoom();

  // app font size
  const { fontSize, setFontSize } = useAppFontSize();

  return (
    <AppContext.Provider
      value={{
        quizInitialReps,
        setQuizInitialReps,
        quizWrongAnswerExtraReps,
        setQuizWrongAnswerExtraReps,
        quizMaxReps,
        setQuizMaxReps,
        theme,
        setTheme,
        removeTheme,
        toggleIonDarkPalette,
        UIMode,
        setUIMode,
        removeUIMode,
        zoom,
        setZoom,
        fontSize,
        setFontSize,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// hook to use app context
export const useAppContext = () => useContext(AppContext);
