// thx zoy-l ❤️ (https://github.com/ionic-team/ionic-framework/issues/29991#issuecomment-2638981348)

import {
  IonTabs as IonicIonTabs,
  IonTabButton as IonicIonTabButton,
  IonApp as IonicIonApp,
  IonBackButton as IonicIonBackButton,
} from '@ionic/react';

export const IonTabs = IonicIonTabs as React.ComponentType<
  ConstructorParameters<typeof IonicIonTabs>[0]
>;

export const IonTabButton = IonicIonTabButton as React.ComponentType<
  ConstructorParameters<typeof IonicIonTabButton>[0] & {
    children: React.ReactNode;
  }
>;

export const IonApp = IonicIonApp as React.ComponentType<
  ConstructorParameters<typeof IonicIonApp>[0]
>;

export const IonBackButton = IonicIonBackButton as React.ComponentType<
  ConstructorParameters<typeof IonicIonBackButton>[0]
>;
