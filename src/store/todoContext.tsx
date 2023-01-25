import { createContext, useContext, ReactNode } from 'react';
import { ErrorMessage, Error } from '../types/Error';
import { FilterStatus } from '../types/Filter';
import { Todo } from '../types/Todo';
import { useTodoStore } from './todoStore';

export interface InitialState {
  todos: Todo[];
  newTodo: string;
  error: Error;
  filter: FilterStatus;
  tempTodo: Todo | null;
}

const initialState: InitialState = {
  todos: [],
  newTodo: '',
  error: [false, ErrorMessage.NoError],
  filter: FilterStatus.All,
  tempTodo: null,
};

const TodoContext = createContext<ReturnType<typeof useTodoStore> | null>(null);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useTodoContext = () => useContext(TodoContext)!;

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  return (
    <TodoContext.Provider value={useTodoStore(initialState)}>
      {children}
    </TodoContext.Provider>
  );
};
