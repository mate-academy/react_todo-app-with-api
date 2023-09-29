import { createRoot } from 'react-dom/client';
import { TodosContextProvider } from './TodosContext';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(
    <TodosContextProvider>
      <App />
    </TodosContextProvider>,
  );
