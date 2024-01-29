import { createContext } from 'react';

import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

interface ContextProps {
  USER_ID: number;
  todos: Todo[];
  errorMessage: string;
  filter: Filter;
  globalLoading: boolean;
  tempTodo: Todo | null;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
  setGlobalLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setTempTodo: React.Dispatch<React.SetStateAction<null | Todo>>,
}

export const Context = createContext<ContextProps>({
  USER_ID: 12176,
  todos: [],
  errorMessage: '',
  filter: Filter.ALL,
  globalLoading: false,
  tempTodo: null,
  setFilter: () => {},
  setTodos: () => {},
  setErrorMessage: () => {},
  setGlobalLoading: () => {},
  setTempTodo: () => {},
});
