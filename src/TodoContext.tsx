import React, { useMemo, useState } from 'react';
import * as todoService from './api/todos';
import { Todo } from './types';
import { DELETE_ERROR, UPDATE_ERROR, USER_ID } from './utils/constants';
import { pickCompletedTodos } from './utils/pickUncompletedTodos';

interface TodoContextType {
  todoItems: Todo[];
  setTodoItems: React.Dispatch<React.SetStateAction<Todo[]>>;
  isLoading: boolean,
  setIsLoading: (isLoading: boolean) => void,
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
  handleStatusChange: (todo: Todo, status: boolean) => void;
  setStatusForAll: () => void;
}

const todoContext: TodoContextType = {
  todoItems: [],
  setTodoItems: () => {},
  isLoading: false,
  setIsLoading: () => {},
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
  setStatusForAll: () => {},
};

export const TodoContext = React.createContext(todoContext);

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todoItems, setTodoItems] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);

  const deleteTodo = (todoId: number) => {
    setProcessingTodoIds(prevTodoIds => [...prevTodoIds, todoId]);
    todoService.deleteTodo(todoId)
      .then(() => setTodoItems(currentTodos => currentTodos
        .filter(todo => todo.id !== todoId)))
      .catch((error) => {
        setErrorMessage(DELETE_ERROR);
        throw error;
      })
      .finally(() => {
        setProcessingTodoIds(currentTodoIds => currentTodoIds
          .filter(id => id !== todoId));
      });
  };

  const completedTodos = pickCompletedTodos(todoItems);

  const clearAllCompleted = () => {
    completedTodos.forEach(({ id }) => deleteTodo(id));
  };

  const uncompletedTodosLength = todoItems.length
  - completedTodos.length;

  const handleStatusChange = async (todo: Todo, status: boolean) => {
    const {
      id,
      title,
      userId,
    } = todo;

    setProcessingTodoIds(prevTodoIds => [...prevTodoIds, id]);

    try {
      const updatedTodo = await todoService.updateTodo({
        id,
        title,
        userId,
        completed: status,
      });

      setTodoItems(prevTodos => prevTodos.map(prevTodo => (
        prevTodo.id !== updatedTodo.id
          ? prevTodo
          : updatedTodo
      )));
    } catch (error) {
      setErrorMessage(UPDATE_ERROR);
      throw error;
    } finally {
      setProcessingTodoIds(currentTodoIds => currentTodoIds
        .filter(currentTodoId => currentTodoId !== id));
    }
  };

  const setStatusForAll = () => {
    const commonStatus = !!uncompletedTodosLength;

    todoItems.forEach((todo) => handleStatusChange(todo, commonStatus));
  };

  const handleTodoUpdate = async (todo: Todo, todoTitle: string) => {
    const {
      id,
      completed,
    } = todo;

    setProcessingTodoIds(prevTodoIds => [...prevTodoIds, id]);

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
      setErrorMessage(UPDATE_ERROR);
      throw error;
    } finally {
      setProcessingTodoIds(currentTodoIds => currentTodoIds
        .filter(currentTodoId => currentTodoId !== id));
    }
  };

  const value = useMemo(() => ({
    todoItems,
    setTodoItems,
    isLoading,
    setIsLoading,
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
    setStatusForAll,
  }), [
    todoItems,
    errorMessage,
    isLoading,
    tempTodo,
    processingTodoIds,
  ]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
