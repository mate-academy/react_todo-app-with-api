import React, {FC, useCallback, useMemo, useState,} from 'react';
import {Todo} from '../types/Todo';
import {ContextValue, Props} from './AppTodoContext.types';
import {ErrorType, FilterType} from "../types/enums";

export const AppTodoContext = React.createContext<ContextValue>({
  todos: [],
  setTodos: () => {},
  visibleTodos: [],
  tempTodo: null,
  setTempTodo: () => {},
  setProcessingTodoIds: () => {},
  completedTodos: [],
  activeTodos: [],
  errorMessage: ErrorType.NoError,
  setErrorMessage: () => {},
  addProcessingTodo: () => {},
  removeProcessingTodo: () => {},
  isTodoProcessing: () => true,
  filterType: FilterType.All,
  setFilterType: () => {},
});

export const AppTodoProvider: FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodoIds, setProcessingTodoIds]
    = useState<Record<number, boolean>>({});
  const [errorMessage, setErrorMessage] = useState(ErrorType.NoError);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);

  const {
    completedTodos,
    activeTodos,
  } = useMemo(() => todos.reduce<{
    completedTodos: Todo[],
    activeTodos: Todo[],
  }>((acc, todo) => {
    if (todo.completed) {
      acc.completedTodos.push(todo);
    } else {
      acc.activeTodos.push(todo);
    }

    return acc;
  }, {
    completedTodos: [],
    activeTodos: [],
  }), [todos]);

  const visibleTodos = useMemo(() => {
    switch (filterType) {
      case FilterType.Completed:
        return completedTodos;

      case FilterType.Active:
        return activeTodos;

      case FilterType.All:
        return todos;

      default:
        return todos;
    }
  }, [todos, filterType]);

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
    tempTodo,
    setTempTodo,
    completedTodos,
    activeTodos,
    setProcessingTodoIds,
    errorMessage,
    setErrorMessage,
    addProcessingTodo,
    removeProcessingTodo,
    isTodoProcessing,
    filterType,
    setFilterType,
  };

  return (
    <AppTodoContext.Provider value={contextValue}>
      {children}
    </AppTodoContext.Provider>
  );
};
