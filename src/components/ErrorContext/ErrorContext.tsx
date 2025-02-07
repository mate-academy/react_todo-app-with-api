import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';

type ErrorState = ErrorMessage | null;

type ErrorAction =
  | { type: 'SET_ERROR'; payload: ErrorMessage }
  | { type: 'CLEAR_ERROR' };

type ErrorContextType = {
  error: ErrorState;
  setError: (message: ErrorMessage) => void;
  clearError: () => void;
};

const errorReducer = (state: ErrorState, action: ErrorAction): ErrorState => {
  switch (action.type) {
    case 'SET_ERROR':
      return action.payload;

    case 'CLEAR_ERROR':
      return null;

    default:
      return state;
  }
};

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [error, dispatch] = useReducer(errorReducer, null);

  const setError = (message: ErrorMessage) => {
    dispatch({ type: 'SET_ERROR', payload: message });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  useEffect(() => {
    if (error) {
      const timerId = setTimeout(clearError, 3000);

      return () => clearTimeout(timerId);
    }
  }, [error]);

  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);

  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }

  return context;
};
