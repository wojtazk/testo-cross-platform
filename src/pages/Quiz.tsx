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
import React, { useEffect } from 'react';
import { useRef, useState } from 'react';
import { useHistory } from 'react-router';
import {
  arrowBack,
  chevronBack,
  ellipsisHorizontal,
  ellipsisVertical,
  save,
  statsChart,
  // trash,
} from 'ionicons/icons';

import './Quiz.css';

import { useAppContext } from '../AppContext';
import { AnswersX } from '../components/AnswersX';
import { AnswersY } from '../components/AnswersY';
import { Timer } from '../components/Timer';
import { ContentWithImages } from '../components/ContentWithImages';
import { useSaveQuizProgress } from '../utils/useSaveQuizProgress';
import { Question } from '../utils/parseQuizQuestion';

const PIWO = {
  tag: 'PIWO',
  reoccurrences: 2137,
  type: 'X',
  content: 'KONIEC',
  answers: [],
};

const Quiz: React.FC = () => {
  const history = useHistory();

  // popover menu
  const popoverElement = useRef<HTMLIonPopoverElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const openPopover = (e: React.MouseEvent | React.TouchEvent) => {
    popoverElement.current!.event = e;
    setPopoverOpen(true);
  };

  const closePopover = () => {
    setPopoverOpen(false);
  };

  // quiz
  const { quizState, dispatchQuizState } = useAppContext();
  const saveQuizProgress = useSaveQuizProgress();
  const currentQuestionRef = useRef(
    quizState.questions[quizState.currentQuestionIndex] || PIWO
  );

  const userAnswersRef = useRef<number[]>(
    Array(currentQuestionRef.current.answers.length).fill(-1)
  );

  const answersElementRef = useRef<HTMLIonRowElement>(null);
  const quizContentElementRef = useRef<HTMLIonContentElement>(null);

  const checkAnswersRef = useRef<boolean>(false);
  const [loadNewQuestion, setLoadNewQuestion] = useState(false);

  const { quizWrongAnswerExtraReps, quizMaxReps } = useAppContext();
  const handleUserAnswer = () => {
    checkAnswersRef.current = true;
    answersElementRef.current?.classList.add('check');
    quizContentElementRef.current?.classList.add('animate');

    setLoadNewQuestion(true);

    const userAnswerCorrect =
      currentQuestionRef.current.type === 'X'
        ? currentQuestionRef.current.answers.every(
            (q, idx) => q.correct == (userAnswersRef.current[idx] == 1)
          )
        : currentQuestionRef.current.type === 'Y'
        ? currentQuestionRef.current.answers.every(
            (q, idx) => q.correct == userAnswersRef.current[idx]
          )
        : false;

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
    answersElementRef.current?.classList.remove('check');
    quizContentElementRef.current?.classList.remove('animate');

    setLoadNewQuestion(false);

    // finish quiz
    if (quizState.questions.length === 0) {
      currentQuestionRef.current = PIWO as Question;
      return;
    }

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
    ).fill(-1);
  };

  // learning timer ref
  const timerRef = useRef(quizState.saveJSON.time);

  useEffect(() => {
    // question-buttons
    const eventHandler = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Enter') {
        document
          .getElementById('question-buttons')
          ?.querySelector('ion-button')
          ?.click();
      }
    };

    document.addEventListener('keydown', eventHandler);

    return () => {
      document.removeEventListener('keydown', eventHandler);
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
                dispatchQuizState({
                  type: 'UPDATE_TIMER',
                  payload: timerRef.current,
                });
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
              <IonItem button onClick={saveQuizProgress}>
                <IonIcon slot="start" aria-hidden="true" icon={save} />
                <IonLabel>Zapisz stan</IonLabel>
              </IonItem>
              <IonItem
                button
                lines="none"
                onClick={() => {
                  dispatchQuizState({
                    type: 'UPDATE_TIMER',
                    payload: timerRef.current,
                  });
                  history.push('/quiz/stats');
                }}
              >
                <IonIcon slot="start" aria-hidden="true" icon={statsChart} />
                <IonLabel>Statystyki</IonLabel>
              </IonItem>
              {/* <IonItem button lines="none">
                <IonIcon
                  color="danger"
                  slot="start"
                  aria-hidden="true"
                  icon={trash}
                />
                <IonLabel color="danger">
                  <b> Zresetuj progress</b>
                </IonLabel>
              </IonItem> */}
            </IonList>
          </IonContent>
        </IonPopover>
      </IonHeader>
      <IonContent ref={quizContentElementRef} class="animate">
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
              <IonLabel>
                {React.useMemo(
                  () => (
                    <>
                      {currentQuestionRef.current.type === 'X' && (
                        // ['hello', 'there', '[img]test.png[/img]']
                        <ContentWithImages
                          content={currentQuestionRef.current.content}
                          transformImages
                        />
                      )}
                      {currentQuestionRef.current.type === 'Y' &&
                        // ['hello', 'there', '{name}']
                        currentQuestionRef.current.content
                          .split(/({.*?})/g)
                          .filter((part) => part.trim() !== '')
                          .map((part, index) =>
                            part.startsWith('{') ? (
                              <IonText key={index} color="primary">
                                {part}
                              </IonText>
                            ) : (
                              <IonText key={index}>{part}</IonText>
                            )
                          )}
                    </>
                  ),
                  // eslint-disable-next-line react-hooks/exhaustive-deps
                  [currentQuestionRef.current]
                )}
              </IonLabel>
            </IonCol>
          </IonRow>

          <IonRow
            ref={answersElementRef}
            id="question-answers"
            class="ion-padding-horizontal ion-margin-bottom"
          >
            <IonCol>
              {React.useMemo(
                () => (
                  <>
                    {currentQuestionRef.current.type === 'X' && (
                      <AnswersX
                        answers={currentQuestionRef.current.answers}
                        checkAnswersRef={checkAnswersRef}
                        userAnswersRef={userAnswersRef}
                      />
                    )}
                    {currentQuestionRef.current.type === 'Y' && (
                      <AnswersY
                        labels={
                          // ['{wybór 1}', '{wybór 2}']
                          currentQuestionRef.current.content.match(
                            /{[^{}]*}/g
                          ) || []
                        }
                        answers={currentQuestionRef.current.answers}
                        checkAnswersRef={checkAnswersRef}
                        userAnswersRef={userAnswersRef}
                      />
                    )}
                  </>
                ),
                // eslint-disable-next-line react-hooks/exhaustive-deps
                [currentQuestionRef.current.answers]
              )}
            </IonCol>
          </IonRow>

          {/* The End - PIWO */}
          {currentQuestionRef.current === PIWO && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img
                style={{ height: '50vh', maxWidth: '80vh' }}
                src="beer.png"
                alt="piwo"
              />
            </div>
          )}

          <IonRow
            id="question-buttons"
            class="ion-margin-top ion-padding-horizontal ion-justify-content-end"
          >
            {currentQuestionRef.current !== PIWO && (
              <IonCol sizeLg="5">
                {!loadNewQuestion && (
                  <IonButton
                    type="submit"
                    fill="outline"
                    expand="block"
                    onClick={handleUserAnswer}
                  >
                    Sprawdź
                  </IonButton>
                )}
                {loadNewQuestion && (
                  <IonButton
                    type="submit"
                    fill="outline"
                    expand="block"
                    onClick={handleLoadNewQuestion}
                  >
                    Następne pytanie
                  </IonButton>
                )}
              </IonCol>
            )}
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
