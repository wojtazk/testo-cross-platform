import {
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';

import React, { useEffect, useRef } from 'react';
import { shuffleArray } from '../utils/arrayShuffle';

export const AnswersY: React.FC<{
  labels: string[];
  answers: { content: string[]; correct: number }[];
  checkAnswersRef: React.RefObject<boolean>;
  userAnswersRef: React.RefObject<number[]>;
}> = React.memo(({ labels, answers, checkAnswersRef, userAnswersRef }) => {
  const answerElementRef = useRef<(HTMLIonListElement | null)[]>([]);
  answerElementRef.current.forEach((el) => {
    if (!el) return;
    el.classList.remove('selected', 'correct', 'wrong');
    (el as HTMLIonListElement).querySelector('ion-select')!.value = undefined;
  });

  useEffect(() => {
    const eventHandler = (event: globalThis.KeyboardEvent) => {
      if (event.key > String(answerElementRef.current.length)) return;
      if (event.key >= '1' && event.key <= '9') {
        const element = answerElementRef.current[Number(event.key) - 1];
        element?.querySelector('ion-select')?.click();
      }
    };

    document.addEventListener('keydown', eventHandler);

    return () => {
      document.removeEventListener('keydown', eventHandler);
    };
  }, []);

  const answersList = answers.map((answer, index) => {
    return (
      <div key={index}>
        <IonList
          inset
          lines="none"
          class="wrong" // initial value
          ref={(el) => {
            answerElementRef.current[index] = el;
          }}
        >
          <IonItem lines="none">
            <IonSelect
              interface="alert"
              okText="OK"
              cancelText="Anuluj"
              placeholder="wybierz"
              onIonChange={(event) => {
                if (checkAnswersRef.current) {
                  // don't allow selects' value change
                  const selectElement = answerElementRef.current[
                    index
                  ]?.querySelector('ion-select') as HTMLIonSelectElement;
                  if (selectElement) {
                    selectElement.value = String(userAnswersRef.current[index]);
                  }
                  return;
                }

                answerElementRef.current[index]?.classList.toggle(
                  'correct',
                  event.detail.value === String(answer.correct)
                );
                answerElementRef.current[index]?.classList.toggle(
                  'wrong',
                  event.detail.value !== String(answer.correct)
                );
                userAnswersRef.current[index] =
                  Number(event.detail.value) || -1;
              }}
            >
              <IonLabel slot="label">{labels[index]}</IonLabel>
              {shuffleArray(
                answer.content.map((option, idx) => {
                  return (
                    <IonSelectOption key={`option-${idx}`} value={`${idx}`}>
                      {option}
                    </IonSelectOption>
                  );
                })
              )}
            </IonSelect>
          </IonItem>
        </IonList>

        <IonNote class="ion-margin">
          Poprawna: <span>{answer.content[answer.correct]}</span>
        </IonNote>
      </div>
    );
  });

  return <>{answersList}</>;
});
