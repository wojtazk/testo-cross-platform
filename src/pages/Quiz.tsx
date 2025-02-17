import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonIcon,
  IonProgressBar,
  IonPopover,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { useRef, useState } from 'react';
import { useHistory } from 'react-router';
import {
  arrowBack,
  chevronBack,
  ellipsisHorizontal,
  ellipsisVertical,
  save,
  statsChart,
  trash,
} from 'ionicons/icons';
import './Quiz.css';

const Quiz: React.FC = () => {
  const history = useHistory();
  false;
  const popoverElement = useRef<HTMLIonPopoverElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const openPopover = (e: any) => {
    popoverElement.current!.event = e;
    setPopoverOpen(true);
  };

  const closePopover = () => {
    setPopoverOpen(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()}>
              <IonIcon slot="icon-only" ios={chevronBack} md={arrowBack} />
            </IonButton>
          </IonButtons>
          {/* FIXME: */}
          <IonTitle>Opanowane: 34 / 100</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={openPopover}>
              <IonIcon
                slot="icon-only"
                ios={ellipsisHorizontal}
                md={ellipsisVertical}
              />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonPopover
          ref={popoverElement}
          isOpen={popoverOpen}
          onDidDismiss={closePopover}
          side="bottom"
          size="auto"
          arrow={false}
          keepContentsMounted
        >
          <IonContent>
            <IonList lines="full" onClick={closePopover}>
              <IonItem button>
                <IonIcon slot="start" aria-hidden="true" icon={save} />
                <IonLabel>Zapisz stan</IonLabel>
              </IonItem>
              <IonItem
                button
                onClick={() => {
                  history.push('/quiz/stats');
                }}
              >
                <IonIcon slot="start" aria-hidden="true" icon={statsChart} />
                <IonLabel>Statystyki</IonLabel>
              </IonItem>
              <IonItem button lines="none">
                <IonIcon
                  color="danger"
                  slot="start"
                  aria-hidden="true"
                  icon={trash}
                />
                <IonLabel color="danger">Zresetuj progress</IonLabel>
              </IonItem>
            </IonList>
          </IonContent>
        </IonPopover>
      </IonHeader>
      <IonContent>
        <IonProgressBar value={0.34} />
        <p>Quiz</p>
      </IonContent>
    </IonPage>
  );
};

export default Quiz;
