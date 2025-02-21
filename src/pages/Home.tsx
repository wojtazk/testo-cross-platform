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
import { useDirectoryDragDrop } from '../utils/useDirectoryDragDrop';
import { useQuizSettings } from '../utils/useQuizSettings';
import { useThemeAndUIStyle } from '../utils/useThemeAndUIStyle';
import { toggleIonDarkPalette } from '../utils/toggleIonDarkPalette';
import { useAppZoom } from '../utils/useAppZoom';
import { useAppFontSize } from '../utils/useAppFontSize';

const Home: React.FC = () => {
  // quiz settings
  const {
    quizInitialReps,
    setQuizInitialReps,
    quizWrongAnswerExtraReps,
    setQuizWrongAnswerExtraReps,
    quizMaxReps,
    setQuizMaxReps,
  } = useQuizSettings();

  // ion modal setup
  const modalRef = useRef<HTMLIonModalElement>(null);
  const pageRef = useRef(null);
  const [presentingElement, setPresentingElement] =
    useState<HTMLElement | null>(null);
  useEffect(() => {
    setPresentingElement(pageRef.current);
  }, []);

  // theme and ui style
  const { theme, setTheme, removeTheme, UIMode, setUIMode, removeUIMode } =
    useThemeAndUIStyle();

  // app zoom (scaling)
  const { zoom, setZoom } = useAppZoom();

  // app font size
  const { fontSize, setFontSize } = useAppFontSize();

  // handle opening dragged dirs
  // FIXME: implement oppening dragged dirs
  const { draggingOver } = useDirectoryDragDrop((paths) => console.log(paths));
  const dropZoneElementRef = useRef(null);
  useEffect(() => {
    if (!dropZoneElementRef.current) return;

    const dropZoneElement = dropZoneElementRef.current as HTMLElement;
    dropZoneElement.style.transition = 'transform 300ms, filter 100ms';

    if (draggingOver) {
      dropZoneElement.style.transform = 'scale(0.95)';
      dropZoneElement.style.filter = 'brightness(1.3)';
    } else {
      dropZoneElement.style.transform = '';
      dropZoneElement.style.filter = '';
    }
  }, [draggingOver]);

  return (
    <IonPage ref={pageRef}>
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
        {/* Settings modal */}
        <IonModal
          ref={modalRef}
          trigger="open-modal"
          presentingElement={presentingElement!}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Ustawienia</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => modalRef.current?.dismiss()}>
                  Zamknij
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <Settings
              quizInitialReps={quizInitialReps}
              setQuizInitialReps={setQuizInitialReps}
              quizWrongAnswerExtraReps={quizWrongAnswerExtraReps}
              setQuizWrongAnswerExtraReps={setQuizWrongAnswerExtraReps}
              quizMaxReps={quizMaxReps}
              setQuizMaxReps={setQuizMaxReps}
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
            <IonCol ref={dropZoneElementRef}>
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
