import { Route } from 'react-router-dom';
// import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonRouterOutlet, setupIonicReact } from '@ionic/react';
// FIXME: fix this when ionic team closes the releated issue
import { IonApp } from './ionic-react-ts-workaround';

import { IonReactRouter } from '@ionic/react-router';

import Home from './pages/Home';
import Quiz from './pages/Quiz';
import QuizStats from './pages/QuizStats';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
import '@ionic/react/css/palettes/dark.class.css';
/* import '@ionic/react/css/palettes/dark.system.css'; */

/* Theme variables */
import './theme/variables.css';

import { AppContextProvider } from './AppContext';

// get user preffered UI style, if undefined ionic handles this
// remove '"' because useLocalStorage hook adds them
const mode = (localStorage.getItem('ui-mode')?.replace(/"/g, '') ||
  undefined) as 'ios' | 'md' | undefined;

const ionConfig: { mode?: 'ios' | 'md' } = { mode };
setupIonicReact(ionConfig);

// NOTE: disable contextmenu and refresh shourtcuts in production builds
if (import.meta.env.MODE === 'production') {
  document.addEventListener('keydown', function (event) {
    // F5 or ctrl+ (windows/linux), command+R (mac)
    if (
      event.key === 'F5' ||
      (event.ctrlKey && event.key === 'r') ||
      (event.metaKey && event.key === 'r')
    ) {
      event.preventDefault();
    }
  });

  document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
  });
}

const App: React.FC = () => {
  return (
    <IonApp>
      <AppContextProvider>
        <IonReactRouter>
          <IonRouterOutlet animated>
            <Route exact path="/" render={() => <Home />} />
            <Route exact path="/quiz" render={() => <Quiz />} />
            <Route exact path="/quiz/stats" render={() => <QuizStats />} />
          </IonRouterOutlet>
        </IonReactRouter>
      </AppContextProvider>
    </IonApp>
  );
};

export default App;
