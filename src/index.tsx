import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';
import { TodosConstextProvider } from './Context/TodosContext';

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(
    <TodosConstextProvider>
      <App />
    </TodosConstextProvider>,
  );
