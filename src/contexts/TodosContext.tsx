import { createContext, useMemo, useRef, useState } from 'react';
import { Todo } from '../types';

type TodosStoreType = {
  todos: Todo[];
  isDeletingCompleted: boolean;
  isChangingStatus: boolean;
  inputFieldRef: React.RefObject<HTMLInputElement> | null;
};

type TodosContextType = {
  todosContext: TodosStoreType;
  setTodosContext: React.Dispatch<React.SetStateAction<TodosStoreType>>;
};

export const TodosContext = createContext<TodosContextType>({
  todosContext: {
    todos: [],
    isDeletingCompleted: false,
    isChangingStatus: false,
    inputFieldRef: null,
  },
  setTodosContext: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodosContextProvider: React.FC<Props> = ({ children }) => {
  const inputFieldRef = useRef(null);
  const [todosContext, setTodosContext] = useState<TodosStoreType>({
    todos: [],
    isDeletingCompleted: false,
    isChangingStatus: false,
    inputFieldRef,
  });

  const value = useMemo(
    () => ({
      todosContext,
      setTodosContext,
    }),
    [todosContext],
  );

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};
