import React, { useEffect, useReducer } from 'react';

import * as todoService from '../api/todos';

import { State } from '../types/State';
import { Filter } from '../types/Filter';
import { TodoError } from '../types/TodoError';
import { Action, actionCreator, reducer } from '../reducer';

export const USER_ID = 11722;

const initialState: State = {
  initialTodos: [],
  selectedFilter: Filter.All,
  tempTodo: null,
  loadingItemsId: [],
  isSubmitting: false,
  isUpdating: false,
  isDeleting: false,
  isEditing: false,
  todoError: TodoError.NoProblem,
};

export const StateContext = React.createContext(initialState);
export const DispatchContext = React.createContext<React.Dispatch<Action>>(
  () => { },
);

type Props = {
  children: React.ReactNode;
};

export const TodoAppContext: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch(actionCreator.clearError());
    todoService.getTodos(USER_ID)
      .then(todos => dispatch(actionCreator.load(todos)))
      .catch(() => {
        dispatch(actionCreator.addError(TodoError.ErrorLoad));
      });
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};
