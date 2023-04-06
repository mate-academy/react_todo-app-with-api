import { createRoot } from 'react-dom/client';

import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.css';

import { LoadingTodosProvider } from './contexts/useLoadingTodosContext';
import { App } from './App';

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(
    <LoadingTodosProvider>
      <App />
    </LoadingTodosProvider>,
  );
