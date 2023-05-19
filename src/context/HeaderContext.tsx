import React from 'react';
import { Todo } from '../types/Todo';

interface HeaderContextType {
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  uploadTodo: (
    addedTodo: Omit<Todo, 'id'>, temporaryTodo: Todo | null
  ) => Promise<void>
}

export const HeaderContext = React.createContext<HeaderContextType>({
  setErrorMessage: () => {},
  uploadTodo: () => Promise.resolve(),
});
