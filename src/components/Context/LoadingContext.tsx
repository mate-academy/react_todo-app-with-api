import React, { useState } from 'react';

type Props = {
  children: React.ReactNode;
};

interface LoaderProps {
  isAdding: boolean,
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>,
  idsForLoader: number[],
  setIdsForLoader: React.Dispatch<React.SetStateAction<number[]>>,
}

export const LoaderContext = React.createContext<LoaderProps>({
  isAdding: false,
  setIsAdding: () => { },
  idsForLoader: [],
  setIdsForLoader: () => { },
});

export const LoaderProvider: React.FC<Props> = ({ children }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [idsForLoader, setIdsForLoader] = useState<number[]>([]);

  const contextValue = {
    isAdding,
    setIsAdding,
    idsForLoader,
    setIdsForLoader,
  };

  return (
    <LoaderContext.Provider value={contextValue}>
      {children}
    </LoaderContext.Provider>
  );
};
