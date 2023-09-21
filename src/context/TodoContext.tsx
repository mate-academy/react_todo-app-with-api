import {
  useState, createContext, useMemo,
} from 'react';
import { Todo } from '../types/Todo';

export const TodoContext = createContext<{
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}>({
  todos: [],
  setTodos: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const value = useMemo(() => ({
    todos,
    setTodos,
  }), [todos]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
