import {
  useState, createContext, useContext,
} from 'react';
import { Todo } from '../types/Todo';

interface TodoTempContextType {
  todoTemp: Todo | null;
  setTodoTemp: React.Dispatch<React.SetStateAction<Todo | null>>;
}

export const TodoTempContext = createContext<TodoTempContextType>({
  todoTemp: null,
  setTodoTemp: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodoTempProvider: React.FC<Props> = ({ children }) => {
  const [todoTemp, setTodoTemp] = useState<Todo | null>(null);

  const value = {
    todoTemp,
    setTodoTemp,
  };

  return (
    <TodoTempContext.Provider value={value}>
      {children}
    </TodoTempContext.Provider>
  );
};

export const useTodoTemp = (): TodoTempContextType => {
  return useContext(TodoTempContext);
};
