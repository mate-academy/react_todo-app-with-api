import { createContext, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  children: React.ReactNode;
}

interface ContextProps {
  todos: Todo[];
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  loadingIds: number[];
  tempTodo: Todo | null;
  onAddTodos: (newTodos: Todo[]) => void;
  onAddTodo: (newTodo: Todo) => void;
  onSaveTempTodo: (newTodo: Todo) => void;
  onDeleteTodo: (id: number) => void;
  onAddLoadingId: (id: number) => void;
  clearLoadingIds: VoidFunction;
  clearTempTodo: VoidFunction;
  onEditTodo: (editedTodo: Todo) => void;
}

const defaultValue = {
  todos: [],
  inputRef: { current: null },
  loadingIds: [],
  tempTodo: null,
  onAddTodos: () => {},
  onAddTodo: () => {},
  onSaveTempTodo: () => {},
  onDeleteTodo: () => {},
  onAddLoadingId: () => {},
  clearTempTodo: () => {},
  clearLoadingIds: () => {},
  onEditTodo: () => {},
};

const TodoContext = createContext<ContextProps>(defaultValue);

const TodoContextProvider = ({ children }: Props) => {
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const onAddTodos = (newTodos: Todo[]) => {
    setTodos(prev => [...prev, ...newTodos]);
  };

  const onAddTodo = (newTodo: Todo) => {
    setTodos(prev => [...prev, newTodo]);
  };

  const onSaveTempTodo = (newTodo: Todo) => {
    setTempTodo(newTodo);
  };

  const onDeleteTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const onAddLoadingId = (id: number) => {
    setLoadingIds(prev => [...prev, id]);
  };

  const clearLoadingIds = () => {
    setLoadingIds([]);
  };

  const clearTempTodo = () => {
    setTempTodo(null);
  };

  const onEditTodo = (editedTodo: Todo) => {
    setTodos(prev => {
      return prev.map(todo => {
        if (todo.id === editedTodo.id) {
          return editedTodo;
        }

        return todo;
      });
    });
  };

  return (
    <TodoContext.Provider
      value={{
        inputRef,
        todos,
        loadingIds,
        tempTodo,
        onAddTodos,
        onAddTodo,
        onSaveTempTodo,
        onAddLoadingId,
        clearLoadingIds,
        onDeleteTodo,
        clearTempTodo,
        onEditTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export { TodoContext, TodoContextProvider };
