import React from 'react';
import { IonLabel } from '@ionic/react';
import { convertMsToTimeString, useTimer } from '../utils/useTimer';

export const Timer: React.FC<{
  timerRef: React.RefObject<number>;
}> = React.memo(({ timerRef }) => {
  const { timer } = useTimer(timerRef.current, 1000);
  timerRef.current = timer;

  return (
    <IonLabel color="medium">
      Czas nauki: {convertMsToTimeString(timer)}
    </IonLabel>
  );
});
