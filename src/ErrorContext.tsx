import React, { useMemo, useState } from 'react';

type ErrorState = {
  error: string,
  setError: (error: string) => void,
};

export const ErrorContext = React.createContext<ErrorState>({
  error: '',
  setError: () => {},
});

interface Props {
  children: React.ReactNode,
}

export const ErrorProvider: React.FC<Props> = ({ children }) => {
  const [error, setError] = useState('');

  const value = useMemo(() => ({
    error,
    setError,
  }), [error]);

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};
