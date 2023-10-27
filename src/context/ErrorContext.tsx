import {
  useState, createContext, useContext,
} from 'react';

interface ErrorContextType {
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  isErrorHidden: boolean;
  setIsErrorHidden: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ErrorContext = createContext<ErrorContextType>({
  errorMessage: '',
  setErrorMessage: () => {},
  isErrorHidden: true,
  setIsErrorHidden: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const ErrorProvider: React.FC<Props> = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorHidden, setIsErrorHidden] = useState(true);

  const value = {
    errorMessage,
    setErrorMessage,
    isErrorHidden,
    setIsErrorHidden,
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = (): ErrorContextType => {
  return useContext(ErrorContext);
};
