import React, { useEffect, useMemo, useState } from 'react';
import * as todoService from '../api/todos';
import { filterByTodoStatus } from '../utils/filterTodoByStatus';
import { Errors } from '../types/Errors';
import { Status } from '../types/Status';
import { TempTodo } from '../types/TempTodo';
import { Todo } from '../types/Todo';
import { USER_ID } from '../variables/UserID';

interface ContextProps {
  todos: Todo[];
  title: string;
  errorMessage: Errors | '';
  filterStatus: Status;
  isInputDisabled: boolean;
  tempTodo: TempTodo | null;
  updatingTodos: number[];
  filterByTodoStatus: (todoItems: Todo[], values: Status) => Todo[];
  setTodos: (v: Todo[] | ((n: Todo[]) => Todo[])) => void;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<Errors | ''>>;
  setFilterStatus: React.Dispatch<React.SetStateAction<Status>>;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  setUpdatingTodos: React.Dispatch<React.SetStateAction<number[]>>;
}

export const TodoContext = React.createContext<ContextProps>({
  todos: [],
  title: '',
  errorMessage: '',
  filterStatus: Status.All,
  isInputDisabled: false,
  tempTodo: null,
  updatingTodos: [],
  filterByTodoStatus: () => [],
  setTodos: () => {},
  setTitle: () => {},
  setErrorMessage: () => {},
  setFilterStatus: () => {},
  setIsInputDisabled: () => {},
  setTempTodo: () => {},
  setUpdatingTodos: () => {},
});

type ProviderProps = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<ProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState<Errors | ''>('');
  const [filterStatus, setFilterStatus] = useState<Status>(Status.All);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [updatingTodos, setUpdatingTodos] = useState<number[]>([]);

  useEffect(() => {
    todoService
      .getTodos(USER_ID)
      .then(setTodos)
      .catch(error => {
        setErrorMessage(Errors.LoadError);
        throw error;
      });
  }, []);

  const value: ContextProps = useMemo(
    () => ({
      todos,
      title,
      errorMessage,
      filterStatus,
      isInputDisabled,
      tempTodo,
      updatingTodos,
      setTodos,
      setTitle,
      setErrorMessage,
      setFilterStatus,
      setIsInputDisabled,
      setTempTodo,
      filterByTodoStatus,
      setUpdatingTodos,
    }),
    [
      updatingTodos,
      errorMessage,
      filterStatus,
      isInputDisabled,
      tempTodo,
      title,
      todos,
    ],
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
