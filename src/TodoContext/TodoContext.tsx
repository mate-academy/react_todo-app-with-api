import {
  useContext,
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  PropsWithChildren,
  FC,
} from 'react';
import { Todo } from '../types/Todo';
import { Errors } from '../utils/enums';

interface TodoContextInterface {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  selectedFilter: string;
  setSelectedFilter: Dispatch<SetStateAction<string>>;
  errorMessage: Errors;
  setErrorMessage: Dispatch<SetStateAction<Errors>>;
  addTodoTitle: string;
  setAddTodoTitle: Dispatch<SetStateAction<string>>;
  editTodoTitle: string;
  setEditTodoTitle: Dispatch<SetStateAction<string>>;
  editingTodoId: number | null;
  setEditingTodoId: Dispatch<SetStateAction<number | null>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  tempTodo: Todo | null;
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
  deletingTodoId: number | null;
  setDeletingTodoId: Dispatch<SetStateAction<number | null>>;
  clearingTodosId: number[];
  setClearingTodosId: Dispatch<SetStateAction<number[]>>;
}

export const TodoContext = createContext<TodoContextInterface>({
  todos: [],
  setTodos: () => {},
  selectedFilter: 'All',
  setSelectedFilter: () => {},
  errorMessage: Errors.NoErrors,
  setErrorMessage: () => {},
  addTodoTitle: '',
  setAddTodoTitle: () => {},
  editTodoTitle: '',
  setEditTodoTitle: () => {},
  editingTodoId: null,
  setEditingTodoId: () => {},
  isLoading: false,
  setIsLoading: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  deletingTodoId: null,
  setDeletingTodoId: () => {},
  clearingTodosId: [],
  setClearingTodosId: () => {},
});

export const useTodoContext = () => useContext(TodoContext);

export const TodoContextProvider: FC<PropsWithChildren> = (
  { children },
) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [errorMessage, setErrorMessage] = useState(Errors.NoErrors);
  const [addTodoTitle, setAddTodoTitle] = useState('');
  const [editTodoTitle, setEditTodoTitle] = useState('');
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [clearingTodosId, setClearingTodosId] = useState<number[]>([]);

  return (
    <TodoContext.Provider value={
      {
        todos,
        setTodos,
        selectedFilter,
        setSelectedFilter,
        errorMessage,
        setErrorMessage,
        addTodoTitle,
        setAddTodoTitle,
        editTodoTitle,
        setEditTodoTitle,
        editingTodoId,
        setEditingTodoId,
        isLoading,
        setIsLoading,
        tempTodo,
        setTempTodo,
        deletingTodoId,
        setDeletingTodoId,
        clearingTodosId,
        setClearingTodosId,
      }
    }
    >
      {children}
    </TodoContext.Provider>
  );
};
