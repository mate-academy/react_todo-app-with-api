import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { setupStore } from 'store';
import { SnackbarProvider } from 'notistack';
import App from './App';

import 'index.css';

const store = setupStore();

const Root = () => (
  <HashRouter>
    <SnackbarProvider maxSnack={3}>
      <Provider store={store}>
        <App />
      </Provider>
    </SnackbarProvider>
  </HashRouter>
);

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(<Root />);
