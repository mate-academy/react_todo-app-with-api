import React, { useEffect, useReducer, useState } from 'react';
import * as todosServise from './api/todos';
import {
  initialValue,
  ActionState,
  USER_ID,
  ErrorType,
} from './helpers/helpers';
import { actions, reducer } from './helpers/reducer';
import { Todo } from './types/Todo';

export const TodosContext = React.createContext(initialValue);

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const [todos, dispatch] = useReducer(reducer, []);
  const [deletedId, setDeletedId] = useState<number[]>([]);
  const [filterTodos, setFilterTodos] = useState(ActionState.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const visibleTodos = todos.filter((todo: Todo) => {
    switch (filterTodos) {
      case ActionState.ACTIVE:
        return !todo.completed;
      case ActionState.COMPLETED:
        return todo.completed;
      default: return true;
    }
  });

  useEffect(() => {
    todosServise.getTodos(USER_ID)
      .then((loadTodos) => {
        dispatch(actions.load(loadTodos));
      })
      .catch((error) => {
        setErrorMessage(ErrorType.Loading);
        throw error;
      });
  }, []);

  return (
    <TodosContext.Provider
      value={{
        todos,
        dispatch,
        filterTodos,
        setFilterTodos,
        visibleTodos,
        errorMessage,
        setErrorMessage,
        deletedId,
        setDeletedId,
        isLoading,
        setIsLoading,
        isSubmitting,
        setIsSubmitting,
        title,
        setTitle,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
