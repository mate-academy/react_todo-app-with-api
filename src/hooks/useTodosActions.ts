import { useCallback, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Todo } from '../types/Todo';
import { TodoActions } from '../types/TodoActions';
import { Filter } from '../types/Filter';
import { ErrorType } from '../types/ErrorTypes';

export const useTodoActions = (): TodoActions => {
  const { dispatch } = useContext(AppContext);

  const addNewTodoLocally = useCallback(
    (todo: Todo) => {
      dispatch({ type: 'ADD_TODO', payload: todo });
    },
    [dispatch],
  );

  const updateTodoLocally = useCallback(
    (todo: Todo) => {
      dispatch({ type: 'UPD_TODO', payload: todo });
    },
    [dispatch],
  );

  const deleteTodoLocally = useCallback(
    (todoId: number) => {
      dispatch({ type: 'DELETE_TODO', payload: todoId });
    },
    [dispatch],
  );

  const disableTodo = useCallback(
    (value: boolean, targetId: number) => {
      dispatch({
        type: 'SET_TODO_DISABLED',
        payload: {
          value: value,
          targetId: targetId,
        },
      });
    },
    [dispatch],
  );

  const updateErrorStatus = useCallback(
    (errorType: string) => {
      dispatch({
        type: 'UPDATE_ERROR_STATUS',
        payload: {
          type: errorType as ErrorType,
        },
      });
    },
    [dispatch],
  );

  const setInputDisabled = useCallback(
    (value: boolean) => {
      dispatch({ type: 'SET_INPUT_DISABLED', payload: value });
    },
    [dispatch],
  );

  const createTempTodo = useCallback(
    (
      data: {
        id: number;
        title: string;
        completed: boolean;
        userId: number;
      } | null,
    ) => {
      dispatch({ type: 'CREATE_TEMP_TODO', payload: data });
    },
    [dispatch],
  );

  const setFilter = useCallback(
    (filter: Filter) => {
      dispatch({
        type: 'SET_FILTER',
        payload: filter as Filter,
      });
    },
    [dispatch],
  );

  const setTargetTodo = useCallback(
    (todoId: number) => {
      dispatch({ type: 'SET_TARGET_TODO', payload: todoId });
    },
    [dispatch],
  );

  return {
    addNewTodoLocally,
    updateTodoLocally,
    deleteTodoLocally,
    disableTodo,
    updateErrorStatus,
    setInputDisabled,
    createTempTodo,
    setFilter,
    setTargetTodo,
  };
};
