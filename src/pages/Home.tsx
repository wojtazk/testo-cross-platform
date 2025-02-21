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

import { useDragDrop } from '../utils/useDragDrop';
import { useAppContext } from '../AppContext';

import { handleLoadQuizData } from '../utils/handleLoadQuizData';

const Home: React.FC = () => {
  // ion modal setup
  const modalRef = useRef<HTMLIonModalElement>(null);
  const pageRef = useRef(null);
  const [presentingElement, setPresentingElement] =
    useState<HTMLElement | null>(null);
  useEffect(() => {
    setPresentingElement(pageRef.current);
  }, []);

  // handle drag drop
  // FIXME: implement oppening dragged dirs
  const { draggingOver, draggedPath } = useDragDrop();
  const dropZoneElementRef = useRef(null);
  useEffect(() => {
    if (!dropZoneElementRef.current) return;
    if (location.pathname !== '/') return;

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

  // handle quiz openig
  // get quiz settings
  const { quizInitialReps } = useAppContext();
  // handle dragged dirs
  // FIXME:
  useEffect(() => {
    if (draggedPath === '') return;
    if (location.pathname !== '/') return;

    handleLoadQuizData(
      { loadProgress: false, quizInitialReps },
      draggedPath
    ).then((data) => console.log(data));
  }, [draggedPath]);

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
          keepContentsMounted
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
            <Settings />
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
