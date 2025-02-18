import {
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonRadio,
  IonRadioGroup,
  IonRange,
} from '@ionic/react';
import { text } from 'ionicons/icons';

import './Settings.css';

type SettingsProps = {
  theme: 'system' | 'light' | 'dark';
  setTheme: React.Dispatch<'system' | 'light' | 'dark'>;
  toggleIonDarkPalette: Function;
};

function Settings({
  theme = 'system',
  setTheme,
  toggleIonDarkPalette,
}: SettingsProps) {
  const handleThemeChange = (newTheme: 'system' | 'light' | 'dark') => {
    setTheme(newTheme);
    if (newTheme === 'system') {
      // Use matchMedia to check the user preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      toggleIonDarkPalette(prefersDark.matches);
    } else {
      toggleIonDarkPalette(newTheme === 'dark');
    }
  };

  return (
    <>
      <IonListHeader>Motyw</IonListHeader>
      <IonList inset>
        <IonRadioGroup
          value={theme}
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
      {/* FIXME */}
      <IonList inset>
        <IonRadioGroup
        //   value={theme}
        //   onIonChange={(event) => handleThemeChange(event.detail.value)}
        >
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
            Liczba dodatkowych powtórzeń przy{' '}
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
            min="0"
            max="20"
            step="1"
            value="10"
          />
        </IonItem>
      </IonList>
    </>
  );
}
export default Settings;
