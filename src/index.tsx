import { createRoot } from 'react-dom/client';
import { UserProvider } from './UserContext';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <UserProvider>
    <App />
  </UserProvider>,
);
