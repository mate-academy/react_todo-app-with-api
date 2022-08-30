import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import App from './App';
import { setupStore } from 'store';
import theme from 'theme';
import 'index.css';

const store = setupStore();

const Root = () => (
  <HashRouter>
    <SnackbarProvider maxSnack={3}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <App />
          </Provider>
        </ThemeProvider>
      </StyledEngineProvider>
    </SnackbarProvider>
  </HashRouter>
);

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(<Root />);
