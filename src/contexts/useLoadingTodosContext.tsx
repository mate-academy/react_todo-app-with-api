import {
  createContext, FC, useContext, useState,
} from 'react';

type LoadingTodosContextProps = {
  loadingTodosIds: number[];
  setLoadingTodosIds: React.Dispatch<React.SetStateAction<number[]>>;
};

const LoadingTodosContext = (
  createContext<LoadingTodosContextProps | undefined>(undefined)
);

interface LoadingTodosProviderProps {
  children: React.ReactNode;
}

export const LoadingTodosProvider: FC<LoadingTodosProviderProps> = (
  ({ children }) => {
    const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);

    return (
      <LoadingTodosContext.Provider
        value={{ loadingTodosIds, setLoadingTodosIds }}
      >
        {children}
      </LoadingTodosContext.Provider>
    );
  });

export const useLoadingTodosContext = () => {
  const loadingTodosContext = useContext(LoadingTodosContext);

  if (loadingTodosContext === undefined) {
    throw new Error(
      'useLoadingTodosContext must be inside a LoadingTodosContext',
    );
  }

  return loadingTodosContext;
};
