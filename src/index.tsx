import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';
import { TodosProvider } from './contexts/todosContext';

const USER_ID = 10538;

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <TodosProvider userId={USER_ID}>
    <App userId={USER_ID} />
  </TodosProvider>,
);
