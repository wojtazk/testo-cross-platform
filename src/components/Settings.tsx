import {
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
import { text } from 'ionicons/icons';

import './Settings.css';

// types
import { Theme, UIMode } from '../pages/Home';
type SettingsProps = {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  removeTheme: () => void;
  toggleIonDarkPalette: (shouldAdd: boolean) => void;
  UIMode: UIMode;
  setUIMode: React.Dispatch<React.SetStateAction<UIMode>>;
  removeUIMode: () => void;
};

function Settings({
  theme,
  setTheme,
  removeTheme,
  toggleIonDarkPalette,
  UIMode,
  setUIMode,
  removeUIMode,
}: SettingsProps) {
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
        Odśwież lub uruchom ponownie aplikację aby zobaczyć efekt
      </IonNote>
      <IonList inset>
        <IonRadioGroup
          value={UIMode ? UIMode : 'default'}
          onIonChange={(event) => handleUIModeChange(event.detail.value)}
        >
          <IonItem>
            <IonRadio value="default">
              <IonLabel>Domyślny</IonLabel>
              <IonNote>
                Wszystko poza iOS domyślnie używa Material Design
              </IonNote>
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

      <IonListHeader>Rozmiar czcionki</IonListHeader>
      {/* FIXME */}
      <IonList inset>
        <IonItem>
          <IonRange value={50}>
            <IonIcon icon={text} size="small" slot="start"></IonIcon>
            <IonIcon icon={text} size="large" slot="end"></IonIcon>
          </IonRange>
        </IonItem>
        <IonItem>Never gonna give you up, Never gonna let you down</IonItem>
      </IonList>

      <IonListHeader>Quiz</IonListHeader>
      {/* FIXME */}
      <IonList inset>
        <IonItem>
          <IonLabel color="medium">
            Liczba dodatkowych powtórzeń w przypadku{' '}
            <span style={{ color: 'var(--ion-color-danger-shade)' }}>
              błędnej
            </span>{' '}
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
            value="1"
          />
        </IonItem>
      </IonList>
      <IonList inset>
        <IonItem>
          <IonLabel color="medium">Wstępna liczba powtórzeń</IonLabel>
        </IonItem>
        <IonItem>
          <IonInput
            labelPlacement="stacked"
            type="number"
            min="1"
            max="20"
            step="1"
            value="2"
          />
        </IonItem>
      </IonList>
      <IonList inset>
        <IonItem>
          <IonLabel color="medium">Maksymalna liczba powtórzeń</IonLabel>
        </IonItem>
        <IonItem>
          <IonInput
            labelPlacement="stacked"
            type="number"
            min="1"
            max="20"
            step="1"
            value="6"
          />
        </IonItem>
      </IonList>
    </>
  );
}
export default Settings;
