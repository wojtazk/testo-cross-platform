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
} from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
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
import { AnswersX } from '../components/AnswersX';
import { Timer } from '../components/Timer';
// import { writeTextFile } from '@tauri-apps/plugin-fs';

const Quiz: React.FC = () => {
  const history = useHistory();

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
  const currentQuestionRef = useRef(
    quizState.questions[quizState.currentQuestionIndex]
  );
  const userAnswersRef = useRef<number[]>(
    Array(currentQuestionRef.current.answers.length).fill(0)
  );
  const answersElementRef = useRef<HTMLIonRowElement>(null);
  const checkAnswersRef = useRef<boolean>(false);
  const [loadNewQuestion, setLoadNewQuestion] = useState(false);

  const { quizWrongAnswerExtraReps, quizMaxReps } = useAppContext();
  const handleUserAnswer = () => {
    checkAnswersRef.current = true;
    answersElementRef.current?.classList.toggle('check', true);

    setLoadNewQuestion(true);

    // TODO: update state
    const userAnswerCorrect = currentQuestionRef.current.answers.every(
      (q, idx) => q.correct == userAnswersRef.current[idx]
    );
    // FIXME: works for X questions
    console.log(userAnswersRef.current);
    console.log(
      currentQuestionRef.current.answers.every(
        (q, idx) => q.correct == userAnswersRef.current[idx]
      )
    );

    quizState.saveJSON.time = timerRef.current;

    if (userAnswerCorrect) {
      currentQuestionRef.current.reoccurrences -= 1;
      quizState.saveJSON.numberOfCorrectAnswers += 1;
    } else {
      currentQuestionRef.current.reoccurrences += quizWrongAnswerExtraReps;
      if (currentQuestionRef.current.reoccurrences > quizMaxReps)
        currentQuestionRef.current.reoccurrences = quizMaxReps;
      quizState.saveJSON.numberOfBadAnswers += 1;
    }

    if (currentQuestionRef.current.reoccurrences === 0) {
      quizState.saveJSON.numberOfLearnedQuestions += 1;

      quizState.saveJSON.reoccurrences.push({
        tag: currentQuestionRef.current.tag,
        value: 0,
      });
    }

    dispatchQuizState({ type: 'UPDATE_STATE' });
  };

  const handleLoadNewQuestion = () => {
    checkAnswersRef.current = false;
    answersElementRef.current?.classList.toggle('check', false);

    setLoadNewQuestion(false);

    // get current question
    const tmp = currentQuestionRef.current;
    // assign new question
    currentQuestionRef.current =
      quizState.questions[quizState.currentQuestionIndex];
    // force question answers component rerender (in case the same question is drawn)
    if (tmp === currentQuestionRef.current) {
      tmp.answers = tmp.answers.slice();
    }

    // clear user answers
    userAnswersRef.current = Array(
      currentQuestionRef.current.answers.length
    ).fill(0);
  };

  // learning timer ref
  const timerRef = useRef(quizState.saveJSON.time);

  useEffect(() => {
    // cleanup when componenet unmounts
    return () => {
      dispatchQuizState({
        type: 'UPDATE_TIMER',
        payload: timerRef.current,
      });
    };
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              aria-label="go back"
              onClick={() => {
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
              <Timer timerRef={timerRef} />
            </IonCol>
          </IonRow>

          <IonRow id="question-content">
            <IonCol class="ion-margin">
              <IonLabel>{currentQuestionRef.current.content}</IonLabel>
            </IonCol>
          </IonRow>

          <IonRow
            ref={answersElementRef}
            id="question-answers"
            class="ion-padding-horizontal ion-margin-bottom"
          >
            <IonCol>
              {currentQuestionRef.current.type === 'X' && (
                <AnswersX
                  answers={currentQuestionRef.current.answers}
                  checkAnswersRef={checkAnswersRef}
                  userAnswersRef={userAnswersRef}
                />
              )}
            </IonCol>
          </IonRow>

          <IonRow
            id="question-buttons"
            class="ion-margin-top ion-padding-horizontal ion-justify-content-end"
          >
            <IonCol sizeLg="5">
              {!loadNewQuestion && (
                <IonButton
                  fill="outline"
                  expand="block"
                  onClick={handleUserAnswer}
                >
                  Sprawdź
                </IonButton>
              )}
              {loadNewQuestion && (
                <IonButton
                  fill="outline"
                  expand="block"
                  onClick={handleLoadNewQuestion}
                >
                  Następne pytanie
                </IonButton>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>

      <IonFooter id="quiz-footer">
        <IonToolbar class="ion-text-center">
          <IonChip>
            <IonLabel>{currentQuestionRef.current.tag}</IonLabel>
          </IonChip>

          <IonChip>
            <IonLabel>
              Ponowne wystąpienia:{' '}
              <IonText color="primary">
                {currentQuestionRef.current.reoccurrences}
              </IonText>
            </IonLabel>
          </IonChip>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Quiz;
