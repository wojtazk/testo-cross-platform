import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { useHistory } from 'react-router';
import { chevronBack, arrowBack } from 'ionicons/icons';
import './Quiz.css';

const QuizStats: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()}>
              <IonIcon slot="icon-only" ios={chevronBack} md={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>Staty</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <p>Quiz Stats</p>
      </IonContent>
    </IonPage>
  );
};

export default QuizStats;
