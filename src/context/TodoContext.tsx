import {
  useState, createContext, useContext,
} from 'react';
import { Todo } from '../types/Todo';

interface TodoContextType {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export const TodoContext = createContext<TodoContextType>({
  todos: [],
  setTodos: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const value = {
    todos,
    setTodos,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = (): TodoContextType => {
  return useContext(TodoContext);
};
