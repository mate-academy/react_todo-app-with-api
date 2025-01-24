import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { App } from './App';
// eslint-disable-next-line import/no-extraneous-dependencies
import { HashRouter as Router } from 'react-router-dom';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

const Root = () => (
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);

root.render(<Root />);
