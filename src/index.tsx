import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { GlobalStateProvider } from './management/TodoContext';
import { App } from './App';

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(
    <GlobalStateProvider>
      <App />
    </GlobalStateProvider>,
  );
