import { createContext } from 'react';

import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

interface ContextProps {
  USER_ID: number;
  todos: Todo[];
  errorMessage: string;
  handleErrorChange: (value: string) => void;
  handleActiveTodos: number;
  completeAll: () => void;
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
}

export const Context = createContext<ContextProps>({
  USER_ID: 12176,
  todos: [],
  errorMessage: '',
  handleErrorChange: () => {},
  handleActiveTodos: 0,
  completeAll: () => {},
  filter: Filter.ALL,
  setFilter: () => {},
  setTodos: () => {},
});
