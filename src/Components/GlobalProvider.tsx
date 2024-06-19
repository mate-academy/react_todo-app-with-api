import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { USER_ID, getTodos } from '../api/todos';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';
import { UserWarning } from '../UserWarning';

type TodoContextType = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  filteredButton: Filter;
  setFilteredButton: React.Dispatch<React.SetStateAction<Filter>>;
  isLoading: boolean;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  tempTodo: Todo | null;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  isToggling: boolean;
  setIsToggling: React.Dispatch<React.SetStateAction<boolean>>;
  clearCompleted: boolean;
  setClearCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  inputRef: React.RefObject<HTMLInputElement>;
  editInputRef: React.RefObject<HTMLInputElement>;
};

export const TodoContext = createContext<TodoContextType | undefined>(
  undefined,
);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredButton, setFilteredButton] = useState<Filter>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isToggling, setIsToggling] = useState(false);
  const [clearCompleted, setClearCompleted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then((data: Todo[]) => setTodos(data))
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTodos([]);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodoContext.Provider
      value={{
        todos,
        setTodos,
        filteredButton,
        setFilteredButton,
        isLoading,
        errorMessage,
        setErrorMessage,
        tempTodo,
        setTempTodo,
        isToggling,
        setIsToggling,
        clearCompleted,
        setClearCompleted,
        inputRef,
        editInputRef,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodoContext = () => {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }

  return context;
};
