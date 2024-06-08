import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';
import { TodoContextProvider } from './contexts/TodoContext';
import { ErrorContextProvider } from './contexts/ErrorContext';
import { LoadingContextProvider } from './contexts/LoadingContext';
import { DeletingContextProvider } from './contexts/DeletingContext';

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <DeletingContextProvider>
    <LoadingContextProvider>
      <ErrorContextProvider>
        <TodoContextProvider>
          <App />
        </TodoContextProvider>
      </ErrorContextProvider>
    </LoadingContextProvider>
  </DeletingContextProvider>,
);
