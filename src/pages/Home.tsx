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
import { useLocalStorage } from 'usehooks-ts';

// toggle "ion-palette-dark" class on the html element
const toggleIonDarkPalette = (shouldAdd: boolean) => {
  document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
};

// Settings component types
export type Theme = 'light' | 'dark' | undefined;
export type UIMode = 'ios' | 'md' | undefined;
export type Zoom = number;
export type FontSize = number;

const Home: React.FC = () => {
  // ion modal setup
  const modal = useRef<HTMLIonModalElement>(null);
  const page = useRef(null);

  const [presentingElement, setPresentingElement] =
    useState<HTMLElement | null>(null);

  useEffect(() => {
    setPresentingElement(page.current);
  }, []);

  // theme and ui style
  const [theme, setTheme, removeTheme] = useLocalStorage<Theme>(
    'theme',
    undefined
  );
  const [UIMode, setUIMode, removeUIMode] = useLocalStorage<UIMode>(
    'uimode',
    undefined
  );

  useEffect(() => {
    // follow the system theme
    if (theme !== undefined) return;

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

  // app scale
  const [zoom, setZoom] = useLocalStorage<Zoom>('zoom', 1);

  useEffect(() => {
    document.documentElement.style.zoom = `${100 * zoom}%`;
  }, [zoom]);

  // app font size
  const [fontSize, setFontSize] = useLocalStorage<FontSize>('fontsize', 1);

  useEffect(() => {
    document.documentElement.style.fontSize = `${100 * fontSize}%`;
  }, [fontSize]);

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
              removeTheme={removeTheme}
              toggleIonDarkPalette={toggleIonDarkPalette}
              UIMode={UIMode}
              setUIMode={setUIMode}
              removeUIMode={removeUIMode}
              zoom={zoom}
              setZoom={setZoom}
              fontSize={fontSize}
              setFontSize={setFontSize}
            />
          </IonContent>
        </IonModal>

        <IonGrid fixed>
          <IonRow>
            <IonCol>
              <IonListHeader>Otwórz Quiz</IonListHeader>
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
