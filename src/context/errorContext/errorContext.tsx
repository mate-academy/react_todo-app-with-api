import { createContext } from 'react';

export interface ErrorContextProps {
  errorMessage: string | null,
  notifyAboutError: (text: string) => void,
}

export const ErrorContext = createContext<ErrorContextProps>({
  errorMessage: '',
  notifyAboutError: () => {},
});
