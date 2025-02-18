import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonModal,
  IonList,
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonListHeader,
} from '@ionic/react';

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { cog, settingsOutline } from 'ionicons/icons';

import './Home.css';
import Settings from '../components/Settings';

// toggle "ion-palette-dark" class on the html element
const toggleIonDarkPalette = (shouldAdd: boolean) => {
  document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
};

const Home: React.FC = () => {
  const modal = useRef<HTMLIonModalElement>(null);
  const page = useRef(null);

  const [presentingElement, setPresentingElement] =
    useState<HTMLElement | null>(null);

  useEffect(() => {
    setPresentingElement(page.current);
  }, []);

  // theme
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system');

  useEffect(() => {
    // FIXME
    // get user preferences from local storage
  }, []);

  useEffect(() => {
    // NOTE: follow the system theme
    if (theme !== 'system') return;

    // Use matchMedia to check the user preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    toggleIonDarkPalette(prefersDark.matches);

    const setDarkPaletteFromMediaQuery = (mediaQuery: MediaQueryListEvent) => {
      toggleIonDarkPalette(mediaQuery.matches);
    };
    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addEventListener('change', setDarkPaletteFromMediaQuery);

    return () => {
      prefersDark.removeEventListener('change', setDarkPaletteFromMediaQuery);
    };
  }, [theme]);

  return (
    <IonPage ref={page}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>🎮 Testownik 👾</IonTitle>
          <IonButtons slot="end">
            <IonButton id="open-modal">
              <IonIcon slot="icon-only" ios={cog} md={settingsOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonModal
          ref={modal}
          trigger="open-modal"
          presentingElement={presentingElement!}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Ustawienia</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => modal.current?.dismiss()}>
                  Zamknij
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <Settings
              theme={theme}
              setTheme={setTheme}
              toggleIonDarkPalette={toggleIonDarkPalette}
            />
          </IonContent>
        </IonModal>

        <IonGrid fixed>
          <IonRow>
            <IonCol>
              <IonListHeader>Otwórz</IonListHeader>
              <IonList lines="none" inset>
                <IonItem>
                  <IonLabel>
                    <Link to="/quiz">Quiz</Link>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonListHeader>Ostatnio używane</IonListHeader>
              <IonList inset>
                <IonItem button>
                  <IonLabel>Item 1</IonLabel>
                </IonItem>
                <IonItem button>
                  <IonLabel>Item 2</IonLabel>
                </IonItem>
                <IonItem button>
                  <IonLabel>Item 3</IonLabel>
                </IonItem>
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
