/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

import { AppProvider } from './Context';
import USER_ID from './helpers/USER_ID';

import { UserWarning } from './Pages/NotAuth/UserWarning';
import { Application } from './Pages/Application/Application';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <AppProvider>
      <Application />
    </AppProvider>
  );
};
