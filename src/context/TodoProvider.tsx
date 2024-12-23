import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import { getTodos } from '../api/todos';
import { errorType } from '../types/ErrorType';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';

type TodoContextType = {
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  tasks: Todo[];
  setTasks: React.Dispatch<React.SetStateAction<Todo[]>>;
  focusInput: () => void;
  completedTodos: Todo[];
  tempTodo: Todo | null;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  isUpdating: number[];
  setIsUpdating: React.Dispatch<React.SetStateAction<number[]>>;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  status: Status;
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
};

type TodoProviderProps = {
  children: ReactNode;
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isUpdating, setIsUpdating] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>(Status.all);
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  useEffect(() => {
    getTodos()
      .then(setTasks)
      .then(() => focusInput())
      .catch(() => setErrorMessage(errorType.load));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(timeoutId);
  }, [errorMessage]);

  const completedTodos = tasks?.filter(todo => todo.completed);

  return (
    <TodoContext.Provider
      value={{
        tasks,
        setTasks,
        completedTodos,
        tempTodo,
        setTempTodo,
        isUpdating,
        setIsUpdating,
        focusInput,
        errorMessage,
        setErrorMessage,
        isSubmitting,
        setIsSubmitting,
        inputRef,
        status,
        setStatus,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodoContext = () => {
  const context = useContext(TodoContext);

  if (context === undefined) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }

  return context;
};
