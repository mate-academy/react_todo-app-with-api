import { createContext } from 'react';

import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

interface ContextProps {
  USER_ID: number;
  todos: Todo[];
  filteredTodos: Todo[];
  errorMessage: string;
  handleErrorChange: (value: string) => void;
  handleActiveTodos: number;
  clearCompleted: () => void;
  handleAddTodo: (todoTitle: string) => void;
  handleRemoveTodo: (todoId: number) => void;
  handleUpdateTodo: (updatedTodo: Todo) => void;
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>
}

export const Context = createContext<ContextProps>({
  USER_ID: 12176,
  todos: [],
  filteredTodos: [],
  errorMessage: '',
  handleErrorChange: () => {},
  handleActiveTodos: 0,
  clearCompleted: () => {},
  handleAddTodo: () => {},
  handleRemoveTodo: () => {},
  handleUpdateTodo: () => {},
  filter: Filter.ALL,
  setFilter: () => {},
});
