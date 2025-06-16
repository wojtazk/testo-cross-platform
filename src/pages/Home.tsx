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
  IonNote,
  IonText,
} from '@ionic/react';

import React from 'react';

import { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import { open } from '@tauri-apps/plugin-dialog';
import { type } from '@tauri-apps/plugin-os';
import { documentDir } from '@tauri-apps/api/path';
import { readDir } from '@tauri-apps/plugin-fs';

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

// get os type
const currentOS = type();
const isMobile = ['ios', 'android'].includes(currentOS);

const Home: React.FC = () => {
  const [quizDir, setQuizDir] = useState('');
  const [quizDirEntries, setQuizDieEntries] = useState<string[]>();
  useEffect(() => {
    if (!isMobile) return;

    (async () => {
      const quizDir = await documentDir();
      const quizDirEntries = isMobile
        ? (await readDir(quizDir))
            .filter((entry) => entry.isDirectory)
            .map((entry) => entry.name)
        : undefined;

      setQuizDir(quizDir);
      setQuizDieEntries(quizDirEntries);
    })();
  }, []);

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
  // handle picking dirs (Desktop only)
  const openQuizDirectory = async (defaultPath: string = '') => {
    const selected = await open({
      directory: true,
      multiple: false,
      defaultPath,
    });

    if (!selected) return;

    loadQuizData(selected);
  };
  // handle dragged dirs
  useEffect(() => {
    if (draggedPath === '') return;
    if (location.pathname !== '/') return;

    loadQuizData(draggedPath);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggedPath]);

  // recently used
  const { recentlyUsed } = useAppContext();

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
            {React.useMemo(
              () => (
                <>
                  {!isMobile && (
                    <IonCol ref={dropZoneElementRef}>
                      <IonListHeader>Otwórz Quiz</IonListHeader>
                      <IonList lines="none" inset>
                        <IonItem
                          button
                          detail
                          aria-label="otwórz quiz"
                          onClick={openQuizDirectory.bind(null, '')}
                        >
                          <IonIcon icon={folderOutline} slot="start" />
                          <IonLabel>Wybierz lub upuść folder</IonLabel>
                        </IonItem>
                      </IonList>
                    </IonCol>
                  )}
                  {isMobile && (
                    <IonCol>
                      <IonListHeader>Twoje Quizy</IonListHeader>
                      <IonNote>
                        <div className="ion-margin-horizontal">
                          Umieść w katalogu:
                          <br />
                          <IonText color="primary">
                            {quizDir.slice(quizDir.indexOf('/Android/'))}
                          </IonText>
                        </div>
                      </IonNote>

                      <IonList inset>
                        {quizDirEntries?.map((dirName, index) => (
                          <IonItem
                            button
                            detail
                            key={index}
                            onClick={() =>
                              loadQuizData(`${quizDir}/${dirName}`)
                            }
                          >
                            <IonIcon icon={folderOutline} slot="start" />
                            <IonLabel>{dirName}</IonLabel>
                          </IonItem>
                        ))}
                      </IonList>
                    </IonCol>
                  )}
                </>
              ),
              // eslint-disable-next-line react-hooks/exhaustive-deps
              [isMobile, quizDir, quizDirEntries]
            )}
          </IonRow>
          <IonRow>
            {recentlyUsed.length > 0 && (
              <IonCol>
                <IonListHeader>Ostatnio używane</IonListHeader>
                <IonList inset>
                  {recentlyUsed.map((quizDir) => (
                    <IonItem
                      button
                      detail
                      key={quizDir}
                      onClick={() =>
                        isMobile
                          ? loadQuizData(quizDir)
                          : openQuizDirectory(quizDir)
                      }
                    >
                      <IonIcon icon={folderOutline} slot="start" />
                      <IonLabel class="text-nowrap">
                        {isMobile
                          ? quizDir.slice(quizDir.lastIndexOf('/') + 1)
                          : quizDir}
                      </IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              </IonCol>
            )}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
