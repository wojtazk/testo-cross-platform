import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import './Quiz.css';

const QuizStats: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>🕹️ Testownik 👾</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <p>Quiz Stats</p>
      </IonContent>
    </IonPage>
  );
};

export default QuizStats;
