import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { AppProvider } from './AppContext';
import { AuthApp } from './AuthApp';

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(
    <AppProvider>
      <AuthApp />
    </AppProvider>,
  );
