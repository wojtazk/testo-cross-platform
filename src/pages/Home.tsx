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

const Home: React.FC = () => {
  return (
    <>
      <IonMenu type="overlay" side="end" contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu Content</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          This is the menu
          content.ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        </IonContent>
      </IonMenu>

      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonMenuToggle slot="end">
              <IonButton shape="round" fill="clear" color="dark">
                <IonIcon slot="icon-only" icon={settingsOutline} />
              </IonButton>
            </IonMenuToggle>
            <IonTitle>🕹️ Testownik 👾</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent class="ion-padding">
          <p>Hello There</p>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Home;
