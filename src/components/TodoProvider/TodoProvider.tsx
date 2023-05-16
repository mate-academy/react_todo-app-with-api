import {
  FC, ReactNode, createContext, useCallback, useEffect, useMemo, useState,
} from 'react';
import { getTodos, patchTodo, deleteTodo } from '../../api/todos';
import { USER_ID } from '../../constants';
import { ErrorType } from '../../types/Error';
import { Todo } from '../../types/Todo';

interface ContextType {
  error: ErrorType;
  todos: Todo[];
  processing: number[];
  setError: React.Dispatch<React.SetStateAction<ErrorType>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setProcessing: React.Dispatch<React.SetStateAction<number[]>>;
  uploadTodos: () => Promise<void>;
  updateTodo: (todoId: number, dataToUpdate: Partial<Todo>) => Promise<void>;
  removeTodo: (todoId: number) => Promise<void>;
}

export const TodoContext = createContext<ContextType>({
  error: ErrorType.None,
  todos: [],
  processing: [],
  setError: () => { },
  setTodos: () => { },
  setProcessing: () => { },
  uploadTodos: async () => { },
  updateTodo: async () => { },
  removeTodo: async () => { },
});

export const TodoProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [error, setError] = useState<ErrorType>(ErrorType.None);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [processing, setProcessing] = useState<number[]>([]);

  const uploadTodos = useCallback(async () => {
    try {
      const uploadedTodos = await getTodos(USER_ID);

      setTodos(uploadedTodos);
    } catch {
      setError(ErrorType.Load);
    }
  }, []);

  useEffect(() => {
    uploadTodos();
  }, []);

  const updateTodo = useCallback(async (
    todoId: number, updatedData: Partial<Todo>,
  ) => {
    try {
      setProcessing(prevState => [...prevState, todoId]);

      await patchTodo(todoId, updatedData);

      setTodos(prevState => prevState.map(
        prevTodo => {
          if (prevTodo.id !== todoId) {
            return prevTodo;
          }

          return { ...prevTodo, ...updatedData };
        },
      ));
    } catch {
      setError(ErrorType.Update);
    } finally {
      setProcessing(prevState => prevState.filter(item => item !== todoId));
    }
  }, []);

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      setProcessing(prev => [...prev, todoId]);

      await deleteTodo(todoId);

      setTodos(prev => prev.filter(({ id }) => id !== todoId));
    } catch {
      setError(ErrorType.Delete);
    } finally {
      setProcessing(prev => prev.filter(id => id !== todoId));
    }
  }, []);

  const contextValue: ContextType = useMemo(() => {
    return {
      error,
      todos,
      processing,
      setError,
      setTodos,
      setProcessing,
      uploadTodos,
      updateTodo,
      removeTodo,
    };
  }, [
    error,
    todos,
    processing,
    setError,
    setTodos,
    setProcessing,
    uploadTodos,
    updateTodo,
    removeTodo,
  ]);

  return (
    <TodoContext.Provider value={contextValue}>
      {children}
    </TodoContext.Provider>
  );
};
