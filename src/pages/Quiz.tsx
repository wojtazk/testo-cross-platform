import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonProgressBar,
} from '@ionic/react';

import { arrowBack, ellipsisVertical } from 'ionicons/icons';

import './Quiz.css';

const Quiz: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton
            shape="round"
            fill="clear"
            color="dark"
            slot="start"
            onClick={() => history.back()}
          >
            <IonIcon slot="icon-only" icon={arrowBack} />
          </IonButton>
          <IonTitle>Opanowane pytania: x / y</IonTitle>
          <IonButton shape="round" fill="clear" color="dark" slot="end">
            <IonIcon slot="icon-only" icon={ellipsisVertical} />
          </IonButton>
          {/* FIXME: */}
          <IonProgressBar value={0.34} />
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <p>Quiz</p>
      </IonContent>
    </IonPage>
  );
};

export default Quiz;
