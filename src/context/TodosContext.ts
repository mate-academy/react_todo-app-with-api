import { createContext } from 'react';
import { TodosContextType } from './type';

export const TodosContext = createContext<TodosContextType | undefined>(
  undefined,
);
