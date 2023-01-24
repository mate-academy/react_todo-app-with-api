import React, { useState } from 'react';

type Props = {
  children: React.ReactNode;
};

interface QueryProps {
  query: string,
  setQuery: React.Dispatch<React.SetStateAction<string>>,
}

export const QueryContext = React.createContext<QueryProps>({
  query: '',
  setQuery: () => { },
});

export const QueryProvider: React.FC<Props> = ({ children }) => {
  const [query, setQuery] = useState('');

  const contextValue = {
    query,
    setQuery,
  };

  return (
    <QueryContext.Provider value={contextValue}>
      {children}
    </QueryContext.Provider>
  );
};
