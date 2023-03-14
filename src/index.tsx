import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './components/App';
import { AuthProvider } from './components/Auth/AuthContext';

export const Root = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

createRoot(document.getElementById('root') as HTMLDivElement).render(<Root />);
