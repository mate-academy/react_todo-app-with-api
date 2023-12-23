import React, { useEffect, useState } from 'react';
import * as API from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { TodoErrors } from './types/TodoErrors';

const USER_ID = 12003;

type GlobalContexTypes = {
  USER_ID: number,
  getTodoList: () => Promise<Todo[]>,
  postNewTodo: (data: Omit<Todo, 'id'>) => Promise<Todo>,
  deleteTodoItem: (todoId: number) => Promise<number>,
  updateTodoItem: (todoId: number,
    data: Pick<Todo, 'completed'> | Pick<Todo, 'title'>,
  ) => Promise<Todo>,
  todos: [],
  setTodos: (todos: Todo[] | ((todos: Todo[]) => Todo[])) => {},
  filter: Filter,
  setFilter: (filter: Filter) => {},
  filteredTodos: [],
  setFilteredTodos: (filteredTodos: Todo[]) => {},
  error: string,
  setError: (error: string | ((error: string) => string)) => {},
  errorId: number,
  setErrorId: (errorId: number) => {},
  tempTodo: null,
  setTempTodo: (tempTodo: Omit<Todo, 'userId'> | null) => {},
  isLoading: boolean,
  setIsLoading: (isLoading: boolean | ((isLoading: boolean) => boolean)) => {},
  isAllUpdating: boolean,
  setIsAllUpdating: (isAllUpdating: boolean
  | ((isAllUpdating: boolean) => boolean)) => {},
  isCompletedRemoving: boolean,
  setIsCompletedRemoving: (isCompletedRemoving: boolean
  | ((isCompletedRemoving: boolean) => boolean)) => {},
  isTitleOnFocus: boolean,
  setIsTitleOnFocus: (isTitleOnFocus: boolean
  | ((isTitleOnFocus: boolean) => boolean)) => {},
  isToggleAll: boolean,
  setIsToggleAll: (isToggleAll: boolean
  | ((isToggleAll: boolean) => boolean)) => {},
};

type GlobalContextProps = {
  USER_ID: number,
  getTodoList: () => Promise<Todo[]>,
  postNewTodo: (data: Omit<Todo, 'id'>) => Promise<Todo>,
  deleteTodoItem: (todoId: number) => Promise<number>,
  updateTodoItem: (todoId: number,
    data: Pick<Todo, 'completed'> | Pick<Todo, 'title'>,
  ) => Promise<Todo>,
  todos: Todo[],
  setTodos: (todos: Todo[] | ((todos: Todo[]) => Todo[])) => void,
  filter: Filter,
  setFilter: (filter: Filter) => void,
  filteredTodos: Todo[],
  setFilteredTodos: (filteredTodos: Todo[]) => void,
  error: string,
  setError: (error: string | ((error: string) => string)) => void,
  errorId: number,
  setErrorId: (errorId: number) => void,
  tempTodo: Omit<Todo, 'userId'> | null,
  setTempTodo: (tempTodo: Omit<Todo, 'userId'> | null) => void,
  isLoading: boolean,
  setIsLoading: (isLoading: boolean) => void,
  isAllUpdating: boolean,
  setIsAllUpdating: (isAllUpdating: boolean
  | ((isAllUpdating: boolean) => boolean)) => void,
  isCompletedRemoving: boolean,
  setIsCompletedRemoving: (isCompletedRemoving: boolean
  | ((isCompletedRemoving: boolean) => boolean)) => void,
  isTitleOnFocus: boolean,
  setIsTitleOnFocus: (isTitleOnFocus: boolean
  | ((isTitleOnFocus: boolean) => boolean)) => void,
  isToggleAll: boolean,
  setIsToggleAll: (isToggleAll: boolean
  | ((isToggleAll: boolean) => boolean)) => void,
};

export const GlobalContex = React.createContext<GlobalContextProps>(
  {} as GlobalContexTypes,
);

type GlobalProviderProps = {
  children: React.ReactNode,
};

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>(todos);
  const [error, setError] = useState('');
  const [errorId, setErrorId] = useState(Date.now());
  const [tempTodo, setTempTodo] = useState<Omit<Todo, 'userId'> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAllUpdating, setIsAllUpdating] = useState(false);
  const [isCompletedRemoving, setIsCompletedRemoving] = useState(false);
  const [isTitleOnFocus, setIsTitleOnFocus] = useState(false);
  const [isToggleAll, setIsToggleAll] = useState(false);

  const getTodoList = async (): Promise<Todo[]> => API.getTodos(USER_ID);
  const postNewTodo = async (data: Omit<Todo, 'id'>): Promise<Todo> => {
    return API.addTodo(data);
  };

  const deleteTodoItem = async (todoId: number): Promise<number> => {
    return API.deleteTodo(todoId);
  };

  const updateTodoItem = async (
    todoId: number,
    data: Pick<Todo, 'completed'> | Pick<Todo, 'title'>,
  ): Promise<Todo> => {
    return API.updateTodo(todoId, data);
  };

  useEffect(() => {
    setError(() => '');
    getTodoList()
      .then(todoList => {
        setTodos(todoList);
        setFilteredTodos(todoList);
      })
      .catch(() => setError(TodoErrors.Load))
      .finally(() => setIsTitleOnFocus(true));
  }, []);

  useEffect(() => {
    switch (filter) {
      case Filter.Active:
        setFilteredTodos(todos.filter(todo => !todo.completed));
        break;

      case Filter.Completed:
        setFilteredTodos(todos.filter(todo => todo.completed));
        break;

      case Filter.All:
      default:
        setFilteredTodos(todos);
    }
  }, [todos, filter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setError(() => '');
      setErrorId(0);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error, errorId]);

  const globalContextValue = {
    USER_ID,
    getTodoList,
    postNewTodo,
    deleteTodoItem,
    updateTodoItem,
    todos,
    setTodos,
    filter,
    setFilter,
    filteredTodos,
    setFilteredTodos,
    error,
    setError,
    errorId,
    setErrorId,
    tempTodo,
    setTempTodo,
    isLoading,
    setIsLoading,
    isAllUpdating,
    setIsAllUpdating,
    isCompletedRemoving,
    setIsCompletedRemoving,
    isTitleOnFocus,
    setIsTitleOnFocus,
    isToggleAll,
    setIsToggleAll,
  };

  return (
    <GlobalContex.Provider value={globalContextValue}>
      {children}
    </GlobalContex.Provider>
  );
};
