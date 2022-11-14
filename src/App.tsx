import React, {
  useContext, useEffect, useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Error } from './components/Error';
import { MainContent } from './components/MainContent';

export const App: React.FC = () => {
  // User
  const user = useContext(AuthContext);

  // Error
  const [error, setError] = useState('');

  const setNewError = (errorText: string) => setError(errorText);

  const resetError = () => setError('');

  useEffect(() => {
    setTimeout(() => {
      setError('');
    }, 3000);
  }, [error]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {user && (
        <MainContent
          user={user}
          setError={setNewError}
        />
      )}

      {error && (
        <Error
          error={error}
          resetError={resetError}
        />
      )}
    </div>
  );
};
