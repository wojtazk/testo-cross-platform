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

import { useAppContext } from '../AppContext';
// import { writeTextFile } from '@tauri-apps/plugin-fs';

const Quiz: React.FC = () => {
  const history = useHistory();

  const { quizState } = useAppContext();

  // FIXME: file write test
  // useEffect(() => {
  //   writeTextFile(
  //     'C:\\Users\\Kowal\\Desktop\\New folder\\test_test.txt',
  //     'Hello There'
  //   );
  // });

  // popover menu
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
            <IonButton aria-label="go back" onClick={() => history.goBack()}>
              <IonIcon slot="icon-only" ios={chevronBack} md={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>{`Opanowane: ${quizState.saveJSON.numberOfLearnedQuestions} / ${quizState.saveJSON.numberOfQuestions}`}</IonTitle>
          <IonButtons slot="end">
            <IonButton aria-label="popover menu" onClick={openPopover}>
              <IonIcon
                slot="icon-only"
                ios={ellipsisHorizontal}
                md={ellipsisVertical}
              />
            </IonButton>
          </IonButtons>
          <IonProgressBar
            aria-label="liczba opanowanych pytań"
            value={
              quizState.saveJSON.numberOfLearnedQuestions /
              quizState.saveJSON.numberOfQuestions
            }
          />
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
                <IonLabel color="danger">
                  <b> Zresetuj progress</b>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonContent>
        </IonPopover>
      </IonHeader>
      <IonContent>
        {/* FIXME: */}
        <p>Quiz</p>
      </IonContent>
    </IonPage>
  );
};

export default Quiz;
