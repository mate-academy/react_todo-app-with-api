import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';
import { TodosContextProvider } from './components/Contexts/TodosContext';
import { LoadingTodosContextProvider } from
  './components/Contexts/LoadingTodosContext';
import { ErrorMessageContextProvider } from
  './components/Contexts/ErrorMessageContext';

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(
    <TodosContextProvider>
      <LoadingTodosContextProvider>
        <ErrorMessageContextProvider>
          <App />
        </ErrorMessageContextProvider>
      </LoadingTodosContextProvider>
    </TodosContextProvider>,
  );
