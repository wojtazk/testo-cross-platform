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
  IonInput,
  IonAccordionGroup,
  IonAccordion,
  IonSpinner,
} from '@ionic/react';

import React, { useCallback } from 'react';

import { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import { open, message } from '@tauri-apps/plugin-dialog';
import { type } from '@tauri-apps/plugin-os';
import { documentDir, join } from '@tauri-apps/api/path';
import {
  readDir,
  exists,
  mkdir,
  open as openFile,
  readFile,
} from '@tauri-apps/plugin-fs';
import { path } from '@tauri-apps/api';

import {
  addOutline,
  chevronDownOutline,
  cog,
  createOutline,
  documentsOutline,
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
  const [quizDirEntries, setQuizDirEntries] = useState<string[]>();
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
      setQuizDirEntries(quizDirEntries);
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
  const openQuizDirectory = useCallback(
    async (defaultPath: string = '') => {
      const selected = await open({
        directory: true,
        multiple: false,
        defaultPath,
      });

      if (!selected) return;

      loadQuizData(selected);
    },
    [loadQuizData]
  );
  // add new quiz (Android only)
  const accordionGroupElement = useRef<HTMLIonAccordionGroupElement>(null);
  const newQuizNameInputElement = useRef<HTMLIonInputElement>(null);
  const [addingQuiz, setAddingQuiz] = useState(false);
  const addNewQuiz = useCallback(async (defaultPath: string = '') => {
    // check if new quiz name is set
    if (!newQuizNameInputElement.current?.value) {
      newQuizNameInputElement.current?.setFocus();
      return;
    }

    const newQuizDir = String(newQuizNameInputElement.current.value);

    // check if the new dir name is unique
    const quizDir = await documentDir();
    const dirExists = await exists(await join(quizDir, newQuizDir));
    if (dirExists) {
      await message('Taki katalog już istnieje', { kind: 'error' });
      return;
    }

    // update UI
    setAddingQuiz(true);
    if (accordionGroupElement.current) {
      accordionGroupElement.current.value = undefined;
    }

    // select files dialog
    const selected = await open({
      directory: false,
      multiple: true,
      defaultPath,
    });
    if (!selected) return;

    console.time('adding new quiz');
    // create the new dir
    await mkdir(`${quizDir}/${newQuizDir}`);

    // copy selected files to quizDir
    await Promise.all(
      selected.map(async (contentURI) => {
        const fileName = await path.basename(contentURI);

        // god, I hate content URIs
        // read URI contents
        const fileContent = await readFile(contentURI);
        // create a new file & write contents
        const file = await openFile(`${quizDir}/${newQuizDir}/${fileName}`, {
          write: true,
          create: true,
        });
        await file.write(fileContent);
        return await file.close();
      })
    );

    // update list of quizes
    setQuizDir(quizDir);
    setQuizDirEntries(
      (await readDir(quizDir))
        .filter((entry) => entry.isDirectory)
        .map((entry) => entry.name)
    );
    console.timeEnd('adding new quiz');

    // reset the new quiz name input
    newQuizNameInputElement.current.value = '';

    // update UI
    setAddingQuiz(false);

    // await message('Dodano nowy quiz', { kind: 'info' });
    return;
  }, []);
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
                  {/* Desktop */}
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
                  {/* Mobile */}
                  {isMobile && (
                    <>
                      <IonCol>
                        <IonListHeader>Twoje Quizy</IonListHeader>
                        <IonNote>
                          <div className="ion-margin-horizontal">
                            Znajdują się w katalogu:
                            <br />
                            <IonText color="primary">
                              {quizDir.slice(quizDir.indexOf('/Android/'))}
                            </IonText>
                          </div>
                        </IonNote>

                        {/* Add new Quiz */}
                        <IonList inset lines="none">
                          <IonAccordionGroup
                            ref={accordionGroupElement}
                            expand="compact"
                          >
                            <IonAccordion
                              value="add-quiz"
                              disabled={addingQuiz}
                            >
                              <IonItem
                                slot="header"
                                button
                                aria-label="dodaj quiz"
                              >
                                {addingQuiz ? (
                                  <IonSpinner slot="start" color="medium" />
                                ) : (
                                  <IonIcon icon={addOutline} slot="start" />
                                )}
                                <IonLabel>
                                  {addingQuiz ? 'Kopiowanie' : 'Dodaj Quiz'}
                                </IonLabel>
                                <IonIcon
                                  slot="end"
                                  icon={chevronDownOutline}
                                  className="ion-accordion-toggle-icon"
                                />
                              </IonItem>
                              <div slot="content">
                                <IonItem>
                                  <IonIcon icon={createOutline} slot="start" />
                                  <IonInput
                                    label="Nazwa"
                                    aria-label="nazwa katalogu"
                                    labelPlacement="stacked"
                                    clearInput
                                    placeholder="kolejny_wartościowy_przedmiot"
                                    required
                                    ref={newQuizNameInputElement}
                                    onIonChange={(event) => {
                                      if (newQuizNameInputElement.current) {
                                        newQuizNameInputElement.current.value =
                                          String(event.target.value).trim();
                                      }
                                    }}
                                  ></IonInput>
                                </IonItem>
                                <IonItem
                                  button
                                  detail
                                  aria-label="wybierz pliki quizu"
                                  onClick={addNewQuiz.bind(null, '')}
                                >
                                  <IonIcon
                                    icon={documentsOutline}
                                    slot="start"
                                  />
                                  <IonLabel>Wybierz wszystkie pliki</IonLabel>
                                </IonItem>
                              </div>
                            </IonAccordion>
                          </IonAccordionGroup>
                        </IonList>

                        {/* Quiz Dirs */}
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
                    </>
                  )}
                </>
              ),
              [
                quizDir,
                quizDirEntries,
                loadQuizData,
                openQuizDirectory,
                addingQuiz,
                addNewQuiz,
              ]
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
