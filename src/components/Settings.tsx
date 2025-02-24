import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonRadio,
  IonRadioGroup,
  IonRange,
} from '@ionic/react';

import React, { useRef } from 'react';
import { hardwareChipOutline, text } from 'ionicons/icons';

import { useAppContext } from '../AppContext';

import './Settings.css';

// types
import { QuizReps } from '../utils/useQuizSettings';
import { Theme, UIMode } from '../utils/useThemeAndUIStyle';

export const Settings: React.FC = () => {
  const {
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
  } = useAppContext();

  // quiz settings
  // controlled inputs with ionic and react ... I hope that I am really dumb
  const quizInitialRepsIonInputElement = useRef<HTMLIonInputElement>(null);
  const quizWrongAnswerExtraRepsIonInputElement =
    useRef<HTMLIonInputElement>(null);
  const quizMaxRepsIonInputElement = useRef<HTMLIonInputElement>(null);

  const handleQuizValuesChange = (
    value: number,
    setValue: React.Dispatch<React.SetStateAction<QuizReps>>,
    inputRef: React.RefObject<HTMLIonInputElement | null>,
    min: number,
    max: number
  ): void => {
    let newValue: number = NaN;

    if (value < min) {
      setValue(min);
      newValue = min;
    } else if (value > max) {
      setValue(max);
      newValue = max;
    } else {
      setValue(value);
      newValue = value;
    }

    if (inputRef.current) {
      inputRef.current.value = newValue;
    }
  };

  const handleThemeChange = (newTheme: Theme | 'system') => {
    if (newTheme === 'system') {
      removeTheme();
      // Use matchMedia to check the user preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      toggleIonDarkPalette(prefersDark.matches);
    } else {
      setTheme(newTheme);
      toggleIonDarkPalette(newTheme === 'dark');
    }
  };

  const handleUIModeChange = (newUIMode: UIMode | 'default') => {
    if (newUIMode === 'default') {
      removeUIMode();
    } else setUIMode(newUIMode);
  };

  return (
    <>
      <IonListHeader>Quiz</IonListHeader>
      <IonList inset>
        <IonItem>
          <IonLabel>
            Liczba dodatkowych powtórzeń w przypadku{' '}
            <span style={{ color: 'var(--ion-color-danger)' }}>błędnej</span>{' '}
            odpowiedzi
          </IonLabel>
        </IonItem>

        <IonItem>
          <IonInput
            labelPlacement="stacked"
            type="number"
            min="0"
            max="20"
            step="1"
            value={quizWrongAnswerExtraReps}
            ref={quizWrongAnswerExtraRepsIonInputElement}
            onIonChange={(event) =>
              handleQuizValuesChange(
                Math.round(Number(event.target.value)),
                setQuizWrongAnswerExtraReps,
                quizWrongAnswerExtraRepsIonInputElement,
                0,
                20
              )
            }
          />
        </IonItem>
      </IonList>
      <IonList inset>
        <IonItem>
          <IonLabel>Wstępna liczba powtórzeń</IonLabel>
        </IonItem>
        <IonItem>
          <IonInput
            labelPlacement="stacked"
            type="number"
            min="1"
            max="20"
            step="1"
            value={quizInitialReps}
            ref={quizInitialRepsIonInputElement}
            onIonChange={(event) =>
              handleQuizValuesChange(
                Math.round(Number(event.target.value)),
                setQuizInitialReps,
                quizInitialRepsIonInputElement,
                1,
                20
              )
            }
          />
        </IonItem>
      </IonList>
      <IonList inset>
        <IonItem>
          <IonLabel>Maksymalna liczba powtórzeń</IonLabel>
        </IonItem>
        <IonItem>
          <IonInput
            labelPlacement="stacked"
            type="number"
            min="1"
            max="20"
            step="1"
            value={quizMaxReps}
            ref={quizMaxRepsIonInputElement}
            onIonChange={(event) => {
              handleQuizValuesChange(
                Math.round(Number(event.target.value)),
                setQuizMaxReps,
                quizMaxRepsIonInputElement,
                1,
                20
              );
            }}
          />
        </IonItem>
      </IonList>

      <IonListHeader>Motyw</IonListHeader>
      <IonList inset>
        <IonRadioGroup
          value={theme ? theme : 'system'}
          onIonChange={(event) => handleThemeChange(event.detail.value)}
        >
          <IonItem>
            <IonRadio value="system">System</IonRadio>
          </IonItem>
          <IonItem>
            <IonRadio value="light">Jasny</IonRadio>
          </IonItem>
          <IonItem>
            <IonRadio value="dark">Ciemny</IonRadio>
          </IonItem>
        </IonRadioGroup>
      </IonList>

      <IonListHeader>Styl Aplikacji</IonListHeader>
      <IonNote class="ion-margin-horizontal">
        Uruchom ponownie aplikację aby zobaczyć efekt
      </IonNote>
      <IonList inset>
        <IonRadioGroup
          value={UIMode ? UIMode : 'default'}
          onIonChange={(event) => handleUIModeChange(event.detail.value)}
        >
          <IonItem>
            <IonRadio value="default">
              <IonLabel>Domyślny</IonLabel>
              <IonNote>iOS na iPhone/iPad, Android na innych</IonNote>
            </IonRadio>
          </IonItem>
          <IonItem>
            <IonRadio value="ios">iOS</IonRadio>
          </IonItem>
          <IonItem>
            <IonRadio value="md">Android (Material Design)</IonRadio>
          </IonItem>
        </IonRadioGroup>
      </IonList>

      <IonListHeader>Skala aplikacji</IonListHeader>
      <IonNote class="ion-margin">{Math.round(zoom * 100)}%</IonNote>
      <IonList inset>
        <IonItem>
          <IonRange
            value={zoom}
            onIonChange={(event) => setZoom(event.detail.value as number)}
            min={0.6}
            max={1.6}
            step={0.1}
            ticks
            snaps
          >
            <IonIcon
              icon={hardwareChipOutline}
              size="small"
              slot="start"
            ></IonIcon>
            <IonIcon
              icon={hardwareChipOutline}
              size="large"
              slot="end"
            ></IonIcon>
          </IonRange>
        </IonItem>
      </IonList>

      <IonListHeader>Rozmiar Tekstu</IonListHeader>
      <IonNote class="ion-margin">{Math.round(fontSize * 100)}%</IonNote>
      <IonList inset>
        <IonItem>
          <IonRange
            value={fontSize}
            onIonChange={(event) => setFontSize(event.detail.value as number)}
            min={0.6}
            max={1.6}
            step={0.1}
            ticks
            snaps
          >
            <IonIcon icon={text} size="small" slot="start"></IonIcon>
            <IonIcon icon={text} size="large" slot="end"></IonIcon>
          </IonRange>
        </IonItem>
        <IonItem>
          <IonLabel>Never gonna give you up, Never gonna let you down</IonLabel>
        </IonItem>
      </IonList>

      <IonListHeader>Reset</IonListHeader>
      <IonList inset>
        <IonItem>
          <IonLabel>Zresetuj aplikacje</IonLabel>
          <IonButton
            slot="end"
            color="danger"
            fill="outline"
            size="small"
            onClick={() => {
              localStorage.clear();
              location.reload();
            }}
          >
            Reset
          </IonButton>
        </IonItem>
      </IonList>
    </>
  );
};
