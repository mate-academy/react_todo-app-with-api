import React, {
  useMemo,
  useState,
  useContext,
  useRef,
  useEffect,
} from 'react';
import * as todoService from './api/todos';
import { Todo } from './types';
import { ERRORS, USER_ID } from './utils/constants';
import { pickCompletedTodos } from './utils/pickUncompletedTodos';

interface TodoContextType {
  todoItems: Todo[];
  setTodoItems: React.Dispatch<React.SetStateAction<Todo[]>>;
  tempTodo: Todo | null;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  processingTodoIds: number[],
  setProcessingTodoIds: (loadingTodoIds: number[]) => void,
  errorMessage: string;
  setErrorMessage: (errorMessage: string) => void;
  deleteTodo: (id: number) => void;
  completedTodos: Todo[];
  clearAllCompleted: () => void;
  uncompletedTodosLength: number;
  handleTodoUpdate: (todo: Todo, todoTitle: string) => void;
  handleStatusChange: (todo: Todo) => void;
  setSingleStatusForAll: () => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  inputLine: React.LegacyRef<HTMLInputElement>;
}

const todoContext: TodoContextType = {
  todoItems: [],
  setTodoItems: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  processingTodoIds: [],
  setProcessingTodoIds: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  deleteTodo: () => {},
  completedTodos: [],
  clearAllCompleted: () => {},
  uncompletedTodosLength: 0,
  handleTodoUpdate: () => {},
  handleStatusChange: () => {},
  setSingleStatusForAll: () => {},
  isLoading: false,
  setIsLoading: () => {},
  inputLine: null,
};

export const TodoContext = React.createContext(todoContext);

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todoItems, setTodoItems] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const inputLine = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading) {
      inputLine.current?.focus();
    }
  }, [isLoading]);

  const deleteTodo = (todoId: number) => {
    setProcessingTodoIds(prevTodoIds => [...prevTodoIds, todoId]);

    setIsLoading(true);
    todoService.deleteTodo(todoId)
      .then(() => setTodoItems(currentTodos => currentTodos
        .filter(todo => todo.id !== todoId)))
      .catch(() => {
        setErrorMessage(ERRORS.DELETE_ERROR);
      })
      .finally(() => {
        setProcessingTodoIds(currentTodoIds => currentTodoIds
          .filter(id => id !== todoId));
        setIsLoading(false);
      });
  };

  const completedTodos = pickCompletedTodos(todoItems);

  const clearAllCompleted = () => Promise.all(
    completedTodos.map(({ id }) => deleteTodo(id)),
  );

  const uncompletedTodosLength = todoItems.length
  - completedTodos.length;

  const handleStatusChange = async (todo: Todo) => {
    const {
      id,
      title,
      userId,
      completed,
    } = todo;

    setProcessingTodoIds(prevTodoIds => [...prevTodoIds, id]);

    setIsLoading(true);
    try {
      const updatedTodo = await todoService.updateTodo({
        id,
        title,
        userId,
        completed: !completed,
      });

      setTodoItems(prevTodos => prevTodos.map(prevTodo => (
        prevTodo.id !== updatedTodo.id
          ? prevTodo
          : updatedTodo
      )));
    } catch (error) {
      setErrorMessage(ERRORS.UPDATE_ERROR);
    } finally {
      setProcessingTodoIds(currentTodoIds => currentTodoIds
        .filter(currentTodoId => currentTodoId !== id));
      setIsLoading(false);
    }
  };

  const setSingleStatusForAll = async () => {
    const uncompletedTodos = todoItems.filter(todo => !todo.completed);

    if (!uncompletedTodosLength) {
      await Promise.all(todoItems.map(handleStatusChange));
    } else {
      await Promise.all(uncompletedTodos.map(handleStatusChange));
    }
  };

  const handleTodoUpdate = async (todo: Todo, todoTitle: string) => {
    const {
      id,
      completed,
    } = todo;

    setProcessingTodoIds(prevTodoIds => [...prevTodoIds, id]);

    setIsLoading(true);
    try {
      const updatedTodo = await todoService.updateTodo({
        id,
        title: todoTitle,
        userId: USER_ID,
        completed,
      });

      setTodoItems(prevTodos => prevTodos.map(prevTodo => (
        prevTodo.id !== updatedTodo.id
          ? prevTodo
          : updatedTodo
      )));
    } catch (error) {
      setErrorMessage(ERRORS.UPDATE_ERROR);
      throw error;
    } finally {
      setProcessingTodoIds(currentTodoIds => currentTodoIds
        .filter(currentTodoId => currentTodoId !== id));
      setIsLoading(false);
    }
  };

  const value = useMemo(() => ({
    todoItems,
    setTodoItems,
    tempTodo,
    setTempTodo,
    processingTodoIds,
    setProcessingTodoIds,
    errorMessage,
    setErrorMessage,
    deleteTodo,
    completedTodos,
    clearAllCompleted,
    uncompletedTodosLength,
    handleTodoUpdate,
    handleStatusChange,
    setSingleStatusForAll,
    isLoading,
    setIsLoading,
    inputLine,
  }), [todoItems, errorMessage, tempTodo,
    inputLine, processingTodoIds, isLoading]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodoContext = () => {
  return useContext(TodoContext);
};
