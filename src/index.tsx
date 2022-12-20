/* eslint-disable max-len */
import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';
import { AuthProvider } from './components/Auth/AuthContext';
import { ProcessedProvider } from './components/ProcessedContext/ProcessedContext';

const Root = () => (
  <AuthProvider>
    <ProcessedProvider>
      <App />
    </ProcessedProvider>
  </AuthProvider>
);

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(<Root />);
