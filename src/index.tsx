import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';
import { AuthProvider } from './components/Auth/AuthContext';
import { LoaderProvider } from './components/Context/LoaderContext';
import { TitleProvider } from './components/Context/TitleContext';

const Root = () => (
  <AuthProvider>
    <TitleProvider>
      <LoaderProvider>
        <App />
      </LoaderProvider>
    </TitleProvider>
  </AuthProvider>
);

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(<Root />);
