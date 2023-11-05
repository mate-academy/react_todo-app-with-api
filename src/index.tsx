import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';
import { FilterContextProvider } from './contexts/FilterContext';
import { TodosContextProvider } from './contexts/TodosContext';

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(
    <FilterContextProvider>
      <TodosContextProvider>
        <App />
      </TodosContextProvider>
    </FilterContextProvider>,
  );
