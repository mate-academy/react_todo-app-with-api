import React from 'react';
import { Todo } from '../types/Todo';

interface FetchContextType {
  deleteTodos: (id: number) => Promise<void>;
  updateTodo: (id: number, data: Partial<Todo>) => Promise<void>;
}

export const FetchContext = React.createContext<FetchContextType>({
  deleteTodos: () => Promise.resolve(),
  updateTodo: () => Promise.resolve(),
});
