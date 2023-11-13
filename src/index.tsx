import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { AppContextProvider } from './Contexts/AppContextProvider';
import { App } from './App';

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <AppContextProvider>
    <App />
  </AppContextProvider>,
);
