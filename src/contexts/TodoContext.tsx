import {
  createContext,
  useMemo,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import { TodoStatus } from '../types/TodoStatus';

export type TodoContextType = {
  todos: Todo[],
  tempTodo: Todo | null,
  filteredTodos: Todo[],
  errorMessage: string,
  idsToChange: number[],
  idsToUpdate: (id: number | null) => void,
  updateTodoList: (todo: Omit<Todo, 'userId'>) => void,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setFilters: React.Dispatch<React.SetStateAction<{ status: TodoStatus }>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
};

export const TodoContext = createContext<TodoContextType>({
  todos: [],
  tempTodo: null,
  idsToChange: [],
  filteredTodos: [],
  errorMessage: '',
  idsToUpdate: () => {},
  setTempTodo: () => {},
  setTodos: () => {},
  setFilters: () => {},
  setErrorMessage: () => {},
  updateTodoList: () => {},
});

interface Props {
  children: React.ReactNode,
}

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [idsToChange, setIdsToChange] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filters, setFilters]
    = useState<{ status: TodoStatus }>({ status: TodoStatus.All });

  const updateTodoList = ({ title, completed, id }: Omit<Todo, 'userId'>) => {
    setTodos(prevTodos => prevTodos.map(todo => (todo.id === id
      ? { ...todo, title, completed }
      : todo)));
  };

  const idsToUpdate = (id: number | null) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    id ? setIdsToChange(prev => [...prev, id]) : setIdsToChange([]);
  };

  const value: TodoContextType = useMemo(() => ({
    todos,
    idsToChange,
    tempTodo,
    errorMessage,
    filteredTodos: todos.filter(todo => {
      switch (filters.status) {
        case 'uncompleted':
          return !todo.completed;
        case 'completed':
          return todo.completed;
        default:
          return true;
      }
    }),
    setTodos,
    setTempTodo,
    setErrorMessage,
    setFilters,
    updateTodoList,
    idsToUpdate,
  }), [todos, idsToChange, tempTodo, errorMessage, filters.status]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
