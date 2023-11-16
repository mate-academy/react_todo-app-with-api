import React, {
  useMemo,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { Todo, NewTodo } from './types/Todo';
import { Status } from './types/Status';
import { ErrorMessage } from './types/Error';
import { USER_ID } from './ultis/userId';
import * as todoServise from './api/todos';

type TodoContext = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  filter: Status;
  setFilter: (status: Status) => void;
  getFilteredTodos: () => Todo[];
  tempTodo: Todo | null;
  setTempTodo: (todo: Todo | null) => void;
  addCurrentTodo: (todo: NewTodo) => Promise<void>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  errorMessage: ErrorMessage;
  setErrorMessage: (message: ErrorMessage) => void;
  processingIds: number[];
  setProcessingIds: (ids: number[]) => void;
  removeTodo: (todoId: number) => Promise<void>;
  updateCurrentTodo: (todo: Todo) => Promise<void>;
};

type Props = {
  children: React.ReactNode;
};

export const TodosContext = React.createContext<TodoContext>({
  todos: [],
  setTodos: () => {},
  filter: Status.ALL,
  setFilter: () => {},
  getFilteredTodos: () => [],
  tempTodo: null,
  setTempTodo: () => {},
  addCurrentTodo: async () => {},
  isLoading: false,
  setIsLoading: () => {},
  errorMessage: ErrorMessage.None,
  setErrorMessage: () => {},
  processingIds: [],
  setProcessingIds: () => {},
  removeTodo: async () => {},
  updateCurrentTodo: async () => {},
});

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Status.ALL);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.None);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    todoServise.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.Load));
  }, []);

  useEffect(() => {
    if (errorMessage) {
      window.setTimeout(() => {
        setErrorMessage(ErrorMessage.None);
      }, 3000);
    }
  }, [errorMessage]);

  const addCurrentTodo = useCallback((
    { title, completed, userId }: NewTodo,
  ) => {
    setTempTodo({
      id: 0,
      title,
      completed,
      userId,
    });

    return todoServise.addTodos({ title, userId, completed })
      .then(newTodo => {
        setTodos(prevTodo => [...prevTodo, newTodo]);
      })
      .catch((error) => {
        setErrorMessage(ErrorMessage.Add);

        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });
  }, []);

  const removeTodo = useCallback((todoId: number) => {
    setIsLoading(true);
    setErrorMessage(ErrorMessage.None);
    setProcessingIds(prev => [...prev, todoId]);

    return todoServise.deleteTodos(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setIsLoading(false);
        setErrorMessage(ErrorMessage.Delete);
        setProcessingIds([]);
      })
      .finally(() => {
        setIsLoading(false);
        setProcessingIds(prev => prev.filter(id => id !== todoId));
      });
  }, []);

  const getFilteredTodos = useCallback(() => {
    switch (filter) {
      case Status.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case Status.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [filter, todos]);

  const updateCurrentTodo = useCallback((updateTodo: Todo) => {
    setProcessingIds(prev => [...prev, updateTodo.id]);
    setErrorMessage(ErrorMessage.None);

    return todoServise.updateTodos(updateTodo)
      .then((todo) => {
        setTodos(prevTodos => {
          const newTodos = prevTodos.map(el => (el.id === updateTodo.id
            ? todo : el));

          return newTodos;
        });
      }).catch(() => {
        setErrorMessage(ErrorMessage.Update);
        throw new Error();
      }).finally(() => {
        setProcessingIds(ids => ids.filter(id => id !== updateTodo.id));
      });
  }, []);

  const todoState = useMemo(() => ({
    todos,
    setTodos,
    filter,
    setFilter,
    getFilteredTodos,
    tempTodo,
    setTempTodo,
    addCurrentTodo,
    isLoading,
    setIsLoading,
    errorMessage,
    setErrorMessage,
    processingIds,
    setProcessingIds,
    removeTodo,
    updateCurrentTodo,
  }), [
    todos,
    tempTodo,
    processingIds,
    isLoading,
    filter,
    errorMessage,
    addCurrentTodo,
    getFilteredTodos,
    removeTodo,
    updateCurrentTodo,
  ]);

  return (
    <TodosContext.Provider value={todoState}>
      {children}
    </TodosContext.Provider>
  );
};
