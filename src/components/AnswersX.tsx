import { IonItem, IonLabel, IonList } from '@ionic/react';
import React, { useRef } from 'react';
import { shuffleArray } from '../utils/arrayShuffle';
import { ContentWithImages } from './ContentWithImages';

export const AnswersX: React.FC<{
  answers: { content: string; correct: boolean }[];
  checkAnswersRef: React.RefObject<boolean>;
  userAnswersRef: React.RefObject<number[]>;
}> = React.memo(({ answers, checkAnswersRef, userAnswersRef }) => {
  // const userSelection;

  const answerElementRef = useRef<any[]>([]);
  answerElementRef.current.forEach((el) => el?.classList.remove('selected'));

  const answersList = answers.map((answer, index) => {
    return (
      <IonList
        inset
        lines="none"
        class={answer.correct ? 'correct' : 'wrong'}
        ref={(el): any => (answerElementRef.current[index] = el)}
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
