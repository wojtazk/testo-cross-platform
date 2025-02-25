import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonIcon,
  IonProgressBar,
  IonPopover,
  IonList,
  IonItem,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonFooter,
  IonText,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { useRef, useState } from 'react';
import { useHistory } from 'react-router';
import {
  arrowBack,
  chevronBack,
  ellipsisHorizontal,
  ellipsisVertical,
  save,
  statsChart,
  trash,
} from 'ionicons/icons';

import './Quiz.css';

import { useAppContext } from '../AppContext';
import { Question } from '../utils/parseQuizQuestion';
import { convertMsToTimeString, useTimer } from '../utils/useTimer';
// import { writeTextFile } from '@tauri-apps/plugin-fs';

const Quiz: React.FC = () => {
  const history = useHistory();

  // FIXME: file write test
  // useEffect(() => {
  //   writeTextFile(
  //     'C:\\Users\\Kowal\\Desktop\\New folder\\test_test.txt',
  //     'Hello There'
  //   );
  // });

  // popover menu
  const popoverElement = useRef<HTMLIonPopoverElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const openPopover = (e: any) => {
    popoverElement.current!.event = e;
    setPopoverOpen(true);
  };

  const closePopover = () => {
    setPopoverOpen(false);
  };

  // quiz
  const { quizState, dispatchQuizState } = useAppContext();
  const currentQuestion = useRef<Question>(
    quizState.questions[quizState.currentQuestionIndex]
  );

  // learning timer
  const { timer } = useTimer(quizState.saveJSON.time, 1000);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              aria-label="go back"
              onClick={() => {
                // FIXME:
                dispatchQuizState({ type: 'UPDATE_TIMER', payload: timer });
                history.goBack();
              }}
            >
              <IonIcon slot="icon-only" ios={chevronBack} md={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>{`Opanowane: ${quizState.saveJSON.numberOfLearnedQuestions} / ${quizState.saveJSON.numberOfQuestions}`}</IonTitle>
          <IonButtons slot="end">
            <IonButton aria-label="popover menu" onClick={openPopover}>
              <IonIcon
                slot="icon-only"
                ios={ellipsisHorizontal}
                md={ellipsisVertical}
              />
            </IonButton>
          </IonButtons>
          <IonProgressBar
            aria-label="liczba opanowanych pytań"
            value={
              quizState.saveJSON.numberOfLearnedQuestions /
              quizState.saveJSON.numberOfQuestions
            }
          />
        </IonToolbar>
        <IonPopover
          ref={popoverElement}
          isOpen={popoverOpen}
          onDidDismiss={closePopover}
          side="bottom"
          size="auto"
          arrow={false}
          keepContentsMounted
        >
          <IonContent>
            <IonList lines="full" onClick={closePopover}>
              <IonItem button>
                <IonIcon slot="start" aria-hidden="true" icon={save} />
                <IonLabel>Zapisz stan</IonLabel>
              </IonItem>
              <IonItem
                button
                onClick={() => {
                  history.push('/quiz/stats');
                }}
              >
                <IonIcon slot="start" aria-hidden="true" icon={statsChart} />
                <IonLabel>Statystyki</IonLabel>
              </IonItem>
              <IonItem button lines="none">
                <IonIcon
                  color="danger"
                  slot="start"
                  aria-hidden="true"
                  icon={trash}
                />
                <IonLabel color="danger">
                  <b> Zresetuj progress</b>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonContent>
        </IonPopover>
      </IonHeader>
      <IonContent>
        {/* FIXME: */}
        <IonGrid fixed>
          <IonRow
            id="question-header"
            class="ion-text-center ion-justify-content-center"
          >
            <IonCol size="small" style={{ fontSize: '90%' }}>
              <IonLabel color="medium">
                Czas nauki: {convertMsToTimeString(timer)}
              </IonLabel>
            </IonCol>
          </IonRow>

          <IonRow id="question-content">
            <IonCol class="ion-text-justify ion-margin">
              <IonLabel>{currentQuestion.current?.content}</IonLabel>
            </IonCol>
          </IonRow>

          <IonRow id="question-answers" class="ion-padding-horizontal">
            <IonCol>
              <IonList inset lines="none">
                <IonItem button detail={false}>
                  <IonLabel>Question X 1</IonLabel>
                </IonItem>
              </IonList>
              <IonList inset lines="none">
                <IonItem button detail={false}>
                  <IonLabel>Question X 2</IonLabel>
                </IonItem>
              </IonList>

              <IonList inset lines="none">
                <IonItem>
                  <IonSelect
                    interface="alert"
                    okText="OK"
                    cancelText="Anuluj"
                    placeholder="wybierz"
                  >
                    <IonLabel slot="label">{'Question Y - {wybór 1}'}</IonLabel>
                    <IonSelectOption value="apple">
                      Apple Apple Apple Apple Apple Apple Apple Apple Apple
                      Apple Apple Apple Apple Apple Apple Apple
                    </IonSelectOption>
                    <IonSelectOption value="banana">Banana</IonSelectOption>
                    <IonSelectOption value="orange">Orange</IonSelectOption>
                  </IonSelect>
                </IonItem>
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>

      <IonFooter id="quiz-footer">
        <IonToolbar class="ion-text-center">
          <IonChip>
            <IonLabel>PLIK_200.txt</IonLabel>
          </IonChip>

          <IonChip>
            <IonLabel>
              Ponowne wystąpienia: <IonText color="primary">12</IonText>
            </IonLabel>
          </IonChip>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Quiz;
