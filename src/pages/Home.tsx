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

import React from 'react';

import { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { open } from '@tauri-apps/plugin-dialog';

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

// types
import { useLoadQuizData } from '../utils/useLoadQuizData';

const Home: React.FC = () => {
  const history = useHistory();
  const { quizState } = useAppContext();

  // ion modal setup
  const modalRef = useRef<HTMLIonModalElement>(null);
  const pageRef = useRef(null);
  const [presentingElement, setPresentingElement] =
    useState<HTMLElement | null>(null);
  useEffect(() => {
    setPresentingElement(pageRef.current);
  }, []);

  // handle drag drop
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
  const loadQuizData = useLoadQuizData();
  // handle picking dirs
  const openQuizDirectory = React.useCallback(async () => {
    const selectedPath = await open({
      // FIXME: mobile implementation
      directory: true,
      multiple: false,
      // defaultPath: await appDir(),
    });
    console.log(selectedPath);

    if (!selectedPath) return;

    loadQuizData(selectedPath);
  }, []);
  // handle dragged dirs
  useEffect(() => {
    if (draggedPath === '') return;
    if (location.pathname !== '/') return;

    loadQuizData(draggedPath);
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
            {/* Continue Quiz */}
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
            {/* Open Quiz */}
            <IonCol ref={dropZoneElementRef}>
              <IonListHeader>Otwórz Quiz</IonListHeader>
              <IonList lines="none" inset>
                <IonItem
                  button
                  detail
                  aria-label="otwórz quiz"
                  onClick={openQuizDirectory}
                >
                  <IonIcon icon={folderOutline} slot="start" />
                  <IonLabel>Wybierz lub upuść folder</IonLabel>
                </IonItem>
              </IonList>
            </IonCol>
          </IonRow>
          <IonRow>
            {/* Recently Used */}
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
