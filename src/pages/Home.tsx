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
  IonProgressBar,
} from '@ionic/react';

import { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import {
  cog,
  folderOpenOutline,
  folderOutline,
  settingsOutline,
} from 'ionicons/icons';

import './Home.css';

import { Settings } from '../components/Settings';

import { useDragDrop } from '../utils/useDragDrop';
import { useAppContext } from '../AppContext';
import { handleLoadQuizData } from '../utils/handleLoadQuizData';

// types
import { QuizState } from '../utils/useQuizState';

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
      dropZoneElement.style.filter = 'brightness(1.2)';
    } else {
      dropZoneElement.style.transform = '';
      dropZoneElement.style.filter = '';
    }
  }, [draggingOver]);

  // handle quiz openig
  const history = useHistory();
  const { quizState, dispatchQuizState } = useAppContext();
  // get quiz settings
  const { quizInitialReps } = useAppContext();
  // handle dragged dirs
  // FIXME:
  useEffect(() => {
    if (draggedPath === '') return;
    if (location.pathname !== '/') return;

    // FIXME: check if save.json exists

    console.time('loading quiz'); // timing quiz load
    handleLoadQuizData(
      { loadProgress: true, quizInitialReps },
      draggedPath
    ).then((quizData) => {
      console.timeEnd('loading quiz'); // timing quiz load
      console.log(quizData); // show loaded quiz
      dispatchQuizState({
        type: 'SET_STATE',
        payload: quizData as QuizState,
      });

      history.push('/quiz');
    });
  }, [draggedPath]);

  return (
    <IonPage ref={pageRef}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>🎮 Testownik 👾</IonTitle>
          <IonButtons slot="end">
            <IonButton id="open-modal" aria-label="menu">
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
            {quizState.saveJSON.location && (
              <IonCol>
                <IonListHeader>Kontynuuj Quiz</IonListHeader>
                <IonList lines="none" inset>
                  <IonItem
                    button
                    detail
                    aria-label="kontynuuj quiz"
                    onClick={() => history.push('/quiz')}
                  >
                    <IonIcon icon={folderOpenOutline} slot="start" />
                    <IonLabel class="text-nowrap">
                      {quizState.saveJSON.location}
                    </IonLabel>
                  </IonItem>
                  <IonProgressBar
                    aria-label="liczba opanowanych pytań"
                    value={
                      quizState.saveJSON.numberOfLearnedQuestions /
                      quizState.saveJSON.numberOfQuestions
                    }
                  />
                </IonList>
              </IonCol>
            )}
          </IonRow>
          <IonRow>
            <IonCol ref={dropZoneElementRef}>
              <IonListHeader>Otwórz Quiz</IonListHeader>
              <IonList lines="none" inset>
                <IonItem button detail aria-label="otwórz quiz">
                  <IonIcon icon={folderOutline} slot="start" />
                  <IonLabel>Wybierz lub upuść folder</IonLabel>
                </IonItem>
              </IonList>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonListHeader>Ostatnio używane</IonListHeader>
              <IonList inset>
                <IonItem button detail>
                  <IonIcon icon={folderOutline} slot="start" />
                  <IonLabel>Item 1</IonLabel>
                </IonItem>
                <IonItem button detail>
                  <IonIcon icon={folderOutline} slot="start" />
                  <IonLabel>Item 2</IonLabel>
                </IonItem>
                <IonItem button detail>
                  <IonIcon icon={folderOutline} slot="start" />
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
