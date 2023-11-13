import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { Provider } from 'react-redux';
import store from './app/store';
import { App } from './App';

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
