import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';
import { AuthProvider } from './components/Auth/AuthContext';
import { QueryProvider } from './components/Context/QueryContext';
import { LoaderProvider } from './components/Context/LoadingContext';

const Root = () => (
  <AuthProvider>
    <QueryProvider>
      <LoaderProvider>
        <App />
      </LoaderProvider>
    </QueryProvider>
  </AuthProvider>
);

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(<Root />);
