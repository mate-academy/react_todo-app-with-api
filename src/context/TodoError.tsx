import {
  FC,
  useState,
  createContext,
  ReactNode,
  useMemo,
} from 'react';

type TTodoErrorProps = {
  children: ReactNode;
};

interface IError {
  errorMessage: string;
  setErrorMessage: (newValue: string) => void;
}

export const ErrorMessage = createContext<IError>({
  errorMessage: '',
  setErrorMessage: () => { },
});

export const TodoError: FC<TTodoErrorProps> = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState('');

  const provider = useMemo(() => ({
    errorMessage,
    setErrorMessage,
  }), [errorMessage]);

  return (
    <ErrorMessage.Provider value={provider}>
      {children}
    </ErrorMessage.Provider>
  );
};
