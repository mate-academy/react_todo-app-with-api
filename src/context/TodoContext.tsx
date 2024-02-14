import React, { useState, useMemo, useEffect } from 'react';
import { Todo } from '../types/Todo';
import * as apiService from '../api/todos';
import { USER_ID } from '../commonConsts/UserID';
import { FilterStatus } from '../types/Status';
import { filterTodoByStatus } from '../utils/FilteringByStatus';
import { TempTodo } from '../types/TempTodo';
import { Error } from '../types/Errors';

interface ContextProps {
  todos: Todo[];
  status: FilterStatus;
  errorMessage: string;
  deletedId: number[];
  loading: boolean;
  title: string;
  tempTodo: TempTodo | null;
  changedTodos: Todo[]
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setDeletedId: (n: number[]) => void;
  deleteTodos: (todoId: number) => void;
  setTodos: (v: Todo[] | ((n: Todo[]) => Todo[])) => void;
  filterTodoByStatus: (todoItems: Todo[], values: FilterStatus) => Todo[];
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
  setStatus: React.Dispatch<React.SetStateAction<FilterStatus>>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setChangedTodos: React.Dispatch<React.SetStateAction<Todo[]>>
}

export const TodoContext = React.createContext<ContextProps>({
  todos: [],
  status: FilterStatus.All,
  errorMessage: '',
  deletedId: [],
  title: '',
  loading: false,
  tempTodo: null,
  setTempTodo: () => {},
  setLoading: () => {},
  setTitle: () => {},
  setDeletedId: () => {},
  deleteTodos: () => {},
  setErrorMessage: () => {},
  setTodos: () => {},
  setStatus: () => [],
  filterTodoByStatus: () => [],
  changedTodos: [],
  setChangedTodos: () => {},
});

type Props = {
  children: React.ReactNode
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(FilterStatus.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [deletedId, setDeletedId] = useState<number[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [changedTodos, setChangedTodos] = useState<Todo[]>([]);

  function loadTodos() {
    apiService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Error.LOAD_ERROR);
      });
  }

  useEffect(loadTodos, []);

  function deleteTodos(todoId: number) {
    apiService.deleteTodos(todoId)
      .catch(() => {
        setErrorMessage(Error.DELETE_ERROR);
      });

    setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
  }

  const value = useMemo(() => ({
    todos,
    status,
    errorMessage,
    deletedId,
    title,
    loading,
    tempTodo,
    changedTodos,
    setChangedTodos,
    setTempTodo,
    setLoading,
    setTitle,
    setDeletedId,
    deleteTodos,
    setErrorMessage,
    setStatus,
    setTodos,
    filterTodoByStatus,
  }), [
    todos,
    status,
    errorMessage,
    deletedId,
    title,
    tempTodo,
    loading,
    changedTodos,
  ]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
