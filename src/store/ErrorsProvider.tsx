import {
  ReactNode,
  useEffect,
  useState,
  createContext,
  useContext,
} from 'react';

type UErrorsContext = {
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
};

const ErrorContext = createContext<UErrorsContext>({
  errorMessage: '',
  setErrorMessage: () => {},
});

type Props = {
  children: ReactNode;
};

export const useErrorNotifications = () => useContext(ErrorContext);

export const ErrorsProvider: React.FC<Props> = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState('');

  const TIME_HIDE_ERROR = 3000;

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timeout = setTimeout(() => setErrorMessage(''), TIME_HIDE_ERROR);

    return () => clearTimeout(timeout);
  }, [errorMessage]);

  return (
    <ErrorContext.Provider value={{ errorMessage, setErrorMessage }}>
      {children}
    </ErrorContext.Provider>
  );
};
