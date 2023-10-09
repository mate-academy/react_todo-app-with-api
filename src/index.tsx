import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';
import { ErrorProvider } from './ErrorContext';
import { TodosProvider } from './TodosContext';

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(
    <ErrorProvider>
      <TodosProvider>
        <App />
      </TodosProvider>
    </ErrorProvider>,
  );
