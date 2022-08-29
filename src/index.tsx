import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import { App } from './App';
import { AuthProvider } from './components/Auth/AuthContext';
import { HashRouter, Route, Routes } from 'react-router-dom';

const AppWithProvider = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

const Root = () => (
  <HashRouter >
    <Routes>
      <Route path="/">
        <Route index element={<AppWithProvider />} />
        <Route path=":filterType" element={<AppWithProvider />} />
      </Route>
    </Routes>
  </HashRouter>
);

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(<Root />);
