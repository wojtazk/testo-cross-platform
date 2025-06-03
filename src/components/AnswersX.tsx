import { IonItem, IonLabel, IonList } from '@ionic/react';
import React, { useEffect, useRef } from 'react';
import { shuffleArray } from '../utils/arrayShuffle';
import { ContentWithImages } from './ContentWithImages';

export const AnswersX: React.FC<{
  answers: { content: string; correct: boolean }[];
  checkAnswersRef: React.RefObject<boolean>;
  userAnswersRef: React.RefObject<number[]>;
}> = React.memo(({ answers, checkAnswersRef, userAnswersRef }) => {
  // const userSelection;

  const answerElementRef = useRef<(HTMLIonListElement | null)[]>([]);
  answerElementRef.current.forEach((el) => el?.classList.remove('selected'));

  useEffect(() => {
    const eventHandler = (event: globalThis.KeyboardEvent) => {
      if (event.key > String(answerElementRef.current.length)) return;
      if (event.key >= '1' && event.key <= '9') {
        document
          .getElementById('question-answers')
          ?.querySelectorAll('ion-item')
          ?.[Number(event.key) - 1]?.click();
      }
    };

    document.addEventListener('keydown', eventHandler);

    return () => {
      document.removeEventListener('keydown', eventHandler);
    };
  }, []);

  const answersList = answers.map((answer, index) => {
    return (
      <IonList
        inset
        lines="none"
        class={answer.correct ? 'correct' : 'wrong'}
        ref={(el) => {
          answerElementRef.current[index] = el;
        }}
        key={index}
        onClick={() => {
          if (checkAnswersRef.current) return;
          answerElementRef.current[index]?.classList.toggle('selected');
          userAnswersRef.current[index] =
            userAnswersRef.current[index] === -1 ? 1 : -1;
        }}
      >
        <IonItem button detail={false} lines="none">
          <IonLabel>
            <ContentWithImages
              content={answer.content}
              transformImages={false}
            />
          </IonLabel>
        </IonItem>
      </IonList>
    );
  });

  return <>{shuffleArray(answersList)}</>;
});
