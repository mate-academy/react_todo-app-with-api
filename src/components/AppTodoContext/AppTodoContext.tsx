import React, { FC, useMemo, useState } from 'react';
import { Todo } from '../../types/Todo';
import { Props, Value } from './AppTodoContext.types';
import { ErrorType } from '../Error/Error.types';

export const AppTodoContext = React.createContext<Value>({
  todos: [],
  setTodos: () => {},
  visibleTodos: [],
  setVisibleTodos: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  processingTodoIDs: [],
  setProcessingTodoIDs: () => {},
  completedTodos: [],
  uncompletedTodos: [],
  errorMessage: 'No error' as ErrorType,
  setErrorMessage: () => {},
});

export const AppTodoProvider: FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodoIDs, setProcessingTodoIDs] = useState<number[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorType>(
    ErrorType.NoError,
  );

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const uncompletedTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  const contextValue = {
    todos,
    setTodos,
    visibleTodos,
    setVisibleTodos,
    tempTodo,
    setTempTodo,
    completedTodos,
    uncompletedTodos,
    processingTodoIDs,
    setProcessingTodoIDs,
    errorMessage,
    setErrorMessage,
  };

  return (
    <AppTodoContext.Provider value={contextValue}>
      {children}
    </AppTodoContext.Provider>
  );
};
