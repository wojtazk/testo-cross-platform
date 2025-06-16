import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonNote,
  IonLabel,
  IonText,
} from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import {
  chevronBack,
  arrowBack,
  timeOutline,
  happyOutline,
  sadOutline,
  beerOutline,
  podiumOutline,
} from 'ionicons/icons';
import './Quiz.css';
import { useAppContext } from '../AppContext';
import { convertMsToTimeString } from '../utils/useTimer';

const QuizStats: React.FC = () => {
  const history = useHistory();
  const { saveJSON } = useAppContext().quizState;

  const [answersSum] = useState(
    saveJSON.numberOfCorrectAnswers + saveJSON.numberOfBadAnswers
  );

  const [demotywatory] = useState([
    'Twoje statystyki wyglądają jak średnia ocen na pierwszym roku – smutno i tragicznie. 📉',
    'Patrz na jasną stronę… Przynajmniej wiesz, czego NIE umiesz! 🧐',
    'Gratulacje! Masz talent do zgadywania. Szkoda, że nietrafnie. 🎯',
    'Procent poprawnych odpowiedzi wygląda jak frekwencja na wykładach. Czyli słabo. 📚',
    'Z takim wynikiem powinieneś dostać stypendium… współczucia. 🎓',
    'Twoje statystyki są tak niskie, że nawet inflacja ich nie podniesie. 📊',
    'Pamiętaj, że to tylko liczby! Niestety, w twoim przypadku wyjątkowo smutne liczby. 😢',
    'Brawo! Jesteś oficjalnie lepszy od… no cóż, może kogoś, kto w ogóle nie podszedł do quizu. 👏',
    'Twój wynik przypomina sytuację na studiach: próbujesz, ale nie wychodzi. 🎭',
    'Jeśli twoje oceny wyglądają jak te statystyki, to mam złe wieści… 📉',
    'Ten wynik… Po prostu nie pokazuj go rodzicom, jeśli chcesz zachować dach nad głową. 🏠',
    'Twoja wiedza rośnie jak studenckie oszczędności – czyli niezbyt. 💸',
    'Statystyki mówią jedno: masz albo pecha, albo coś do nadrobienia (jesteś głupi). A raczej jedno i drugie. 😆',
    'Patrząc na ten wynik, zaczynam się zastanawiać, jak udało ci się w ogóle włączyć tę aplikację. 🤨',
    'Twoje statystyki wyglądają jak budżet studencki – żałośnie niskie. 💸',
    'Może spróbuj losować odpowiedzi? Gorzej już chyba nie będzie… albo będzie. 🎲',
    'Jeśli to był test na to, jak mało można wiedzieć, to gratulacje – zdałeś perfekcyjnie. 🎯',
  ]);

  const [demotywatorIdx] = useState(
    Math.floor(Math.random() * demotywatory.length)
  );

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
        <IonList inset>
          <IonItem>
            <IonIcon
              color="secondary"
              slot="start"
              icon={timeOutline}
            ></IonIcon>
            <IonLabel>
              Czas:{' '}
              <IonText color="secondary">
                {convertMsToTimeString(saveJSON.time)}
              </IonText>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon color="warning" slot="start" icon={beerOutline}></IonIcon>
            <IonLabel>
              Opanowane pytania:{' '}
              <IonText color="warning">{`${saveJSON.numberOfLearnedQuestions} / ${saveJSON.numberOfQuestions}`}</IonText>
            </IonLabel>
            <IonNote slot="end" color="warning">{`${(
              (saveJSON.numberOfLearnedQuestions / saveJSON.numberOfQuestions) *
              100
            ).toFixed(2)}%`}</IonNote>
          </IonItem>
          <IonItem>
            <IonIcon
              color="tertiary"
              slot="start"
              icon={podiumOutline}
            ></IonIcon>
            <IonLabel>
              Liczba odpowiedzi:{' '}
              <IonText color="tertiary">{answersSum}</IonText>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon color="success" slot="start" icon={happyOutline}></IonIcon>
            <IonLabel>
              Poprawne odpowiedzi:{' '}
              <IonText color="success">
                {saveJSON.numberOfCorrectAnswers}
              </IonText>
            </IonLabel>
            <IonNote slot="end" color="success">
              {`${(
                (saveJSON.numberOfCorrectAnswers / answersSum) *
                100
              ).toFixed(2)}%`}
            </IonNote>
          </IonItem>
          <IonItem>
            <IonIcon color="danger" slot="start" icon={sadOutline}></IonIcon>
            <IonLabel>
              Błędne odpowiedzi:{' '}
              <IonText color="danger">{saveJSON.numberOfBadAnswers}</IonText>
            </IonLabel>
            <IonNote slot="end" color="danger">{`${(
              (saveJSON.numberOfBadAnswers / answersSum) *
              100
            ).toFixed(2)}%`}</IonNote>
          </IonItem>
        </IonList>

        <div className="ion-text-center ion-margin">
          {demotywatory[demotywatorIdx]}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default QuizStats;
