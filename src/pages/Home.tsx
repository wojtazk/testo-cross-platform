import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonMenu,
  IonButton,
  IonMenuToggle,
  IonIcon,
} from '@ionic/react';

import { settingsOutline } from 'ionicons/icons';

import './Home.css';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <>
      <IonMenu type="overlay" side="end" contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Ustawienia</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          Ustawienia NotImplemented ... yet
        </IonContent>
      </IonMenu>

      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>🎮 Testownik 👾</IonTitle>
            <IonMenuToggle slot="end">
              <IonButton shape="round" fill="clear" color="dark">
                <IonIcon slot="icon-only" icon={settingsOutline} />
              </IonButton>
            </IonMenuToggle>
          </IonToolbar>
        </IonHeader>
        <IonContent class="ion-padding">
          <Link to="/quiz">Quiz</Link>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Home;
