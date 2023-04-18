import React, {FC, useCallback, useMemo, useState} from 'react';
import {Todo} from '../types/Todo';
import {Props, Value} from './AppTodoContext.types';
import {ErrorType} from '../components/Error/Error.types';

export const AppTodoContext = React.createContext<Value>({
  todos: [],
  setTodos: () => {},
  visibleTodos: [],
  setVisibleTodos: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  setProcessingTodoIds: () => {},
  completedTodos: [],
  uncompletedTodos: [],
  errorMessage: ErrorType.NoError,
  setErrorMessage: () => {},
  addProcessingTodo: () => {},
  removeProcessingTodo: () => {},
  isTodoProcessing: () => true,
});

export const AppTodoProvider: FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodoIds, setProcessingTodoIds]
    = useState<Record<number, boolean>>({});
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(ErrorType.NoError);

  const {
    completedTodos,
    uncompletedTodos,
  } = useMemo(() => {
    return todos.reduce<{
      completedTodos: Todo[],
      uncompletedTodos: Todo[],
    }>((acc, todo) => {
      if (todo.completed) {
        acc.completedTodos.push(todo);
      } else {
        acc.uncompletedTodos.push(todo);
      }

      return acc;
    }, {
      completedTodos: [],
      uncompletedTodos: [],
    });
  }, [todos]);

  const addProcessingTodo = useCallback((id: number) => {
    setProcessingTodoIds(currentTodosIds => ({
      ...currentTodosIds,
      [id]: true,
    }));
  }, []);

  const removeProcessingTodo = useCallback((id: number) => {
    setProcessingTodoIds(prevTodosIds => {
      const currentTodosIds = { ...prevTodosIds };

      delete currentTodosIds[id];

      return { ...currentTodosIds };
    });
  }, []);

  const isTodoProcessing = useCallback((id: number) => (
    processingTodoIds[id] || false
  ), [processingTodoIds]);

  const contextValue = {
    todos,
    setTodos,
    visibleTodos,
    setVisibleTodos,
    tempTodo,
    setTempTodo,
    completedTodos,
    uncompletedTodos,
    setProcessingTodoIds,
    errorMessage,
    setErrorMessage,
    addProcessingTodo,
    removeProcessingTodo,
    isTodoProcessing,
  };

  return (
    <AppTodoContext.Provider value={contextValue}>
      {children}
    </AppTodoContext.Provider>
  );
};
