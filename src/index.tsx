import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';
import { TodosProvider } from './TodosProvider/TodosProvider';

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <BrowserRouter>
    <TodosProvider>
      <App />
    </TodosProvider>
  </BrowserRouter>,
);
