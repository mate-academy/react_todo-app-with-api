import { createRoot } from 'react-dom/client';

import '@fortawesome/fontawesome-free/css/all.css';
import 'bulma/css/bulma.css';
import './styles/index.scss';

import { App } from './App';
import { TodosProvider } from './context/TodosContext';

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <TodosProvider>
    <App />
  </TodosProvider>,
);
