import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import './Quiz.css';

const Quiz: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>🕹️ Testownik 👾</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <p>Quiz</p>
      </IonContent>
    </IonPage>
  );
};

export default Quiz;
