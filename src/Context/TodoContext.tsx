import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import { CurrentError } from '../types/CurrentError';
import * as todoService from '../api/todos';
import { Todo } from '../types/Todo';
import { getCompletedTodos } from '../utils/getCompletedTodos';
import { getActiveTodos } from '../utils/getActiveTodos';

type Props = {
  children: React.ReactNode
};

interface TodoContextInterface {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  tempTodo: Todo | null;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: CurrentError,
  setError: (error: CurrentError) => void;
  handleToggleChange: (todo: Todo) => void;
  handleTodoDelete: (id: number) => void;
  handleTodoAdd: (newTodo: Omit<Todo, 'id'>) => Promise<void>
  handleTodoRename: (todo: Todo, newTodoTitle: string) => Promise<void> | void,
  completedTodos: Todo[];
  activeTodos: Todo[];
  handleClearCompleted: () => void;
  processingTodoIds: number[];
  setProcessingTodoIds: (todoIdsToDelete: number[]) => void;
}

const initalContext: TodoContextInterface = {
  todos: [],
  setTodos: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  isLoading: false,
  setIsLoading: () => {},
  error: CurrentError.Default,
  setError: () => {},
  handleToggleChange: () => {},
  handleTodoDelete: () => {},
  handleTodoAdd: async () => {},
  handleTodoRename: async () => {},
  completedTodos: [],
  activeTodos: [],
  handleClearCompleted: () => {},
  processingTodoIds: [],
  setProcessingTodoIds: () => {},
};

export const TodoContext = createContext(initalContext);

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState(CurrentError.Default);
  const [isLoading, setIsLoading] = useState(false);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);

  const completedTodos = getCompletedTodos(todos);
  const activeTodos = getActiveTodos(todos);

  const handleTodoDelete = (todoId: number) => {
    setIsLoading(true);
    setProcessingTodoIds(prevState => [...prevState, todoId]);

    todoService.deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => {
          return prevTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch(() => {
        setError(CurrentError.DeleteError);
      })
      .finally(() => {
        setProcessingTodoIds(
          (prevState) => prevState.filter(id => id !== todoId),
        );
        setIsLoading(false);
      });
  };

  const handleTodoAdd = (newTodo: Omit<Todo, 'id'>) => {
    setIsLoading(true);

    return todoService.addTodo(newTodo)
      .then(createdTodo => {
        setTodos((prevTodos) => [...prevTodos, createdTodo]);
      })
      .catch(() => {
        setError(CurrentError.AddError);
        throw new Error();
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const handleTodoRename = (todo: Todo, newTodoTitle: string) => {
    if (todo.title === newTodoTitle) {
      return;
    }

    if (!newTodoTitle.trim()) {
      setError(CurrentError.EmptyTitleError);

      return;
    }

    setIsLoading(true);
    setProcessingTodoIds(prevState => [...prevState, todo.id]);

    // eslint-disable-next-line consistent-return
    return todoService
      .updateTodo({
        ...todo,
        title: newTodoTitle,
      })
      .then(updatedTodo => {
        setTodos(prevState => prevState.map(currTodo => {
          return currTodo.id !== updatedTodo.id
            ? currTodo
            : updatedTodo;
        }));
      })
      .catch(() => {
        setError(CurrentError.UpdateError);
        throw new Error(CurrentError.UpdateError);
      })
      .finally(() => {
        setProcessingTodoIds(
          (prevState) => prevState.filter(id => id !== todo.id),
        );
        setIsLoading(false);
      });
  };

  const handleToggleChange = (todo: Todo) => {
    setIsLoading(true);
    setProcessingTodoIds(prevState => [...prevState, todo.id]);

    todoService.updateTodo({
      ...todo,
      completed: !todo.completed,
    })
      .then((updatedTodo) => {
        setTodos(prevState => prevState
          .map(currTodo => (
            currTodo.id === updatedTodo.id
              ? updatedTodo
              : currTodo
          )));
      })
      .catch(() => {
        setError(CurrentError.UpdateError);
        throw new Error(CurrentError.UpdateError);
      })
      .finally(() => {
        setProcessingTodoIds(
          (prevState) => prevState.filter(id => id !== todo.id),
        );
        setIsLoading(false);
      });
  };

  const handleClearCompleted = () => {
    completedTodos.forEach(({ id }) => handleTodoDelete(id));
  };

  const value = useMemo(() => ({
    todos,
    setTodos,
    tempTodo,
    setTempTodo,
    isLoading,
    setIsLoading,
    error,
    setError,
    handleToggleChange,
    handleTodoDelete,
    handleTodoAdd,
    handleTodoRename,
    completedTodos,
    activeTodos,
    handleClearCompleted,
    processingTodoIds,
    setProcessingTodoIds,
  }), [todos, error, isLoading, tempTodo]);

  return (
    <TodoContext.Provider
      value={value}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => useContext(TodoContext);
