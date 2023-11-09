import React, { useEffect, useReducer } from 'react';

import { GlobalState } from '../types/GlobalState';
import { Action, ActionType, reducer } from './Reducer';
import { ErrorType } from '../types/ErrorType';
import { getTodos } from '../api/todos';

interface Props {
  children: React.ReactNode,
}

const initialState: GlobalState = {
  userId: 11707,
  todos: [],
  todosToProcess: [],
  tempTodo: null,
  error: null,
};

export const DispatchContext = React.createContext(
  (_action: Action) => {}, // eslint-disable-line @typescript-eslint/no-unused-vars
);
export const StateContext = React.createContext(
  initialState,
);

export const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getTodos(state.userId)
      .then((response) => {
        dispatch({
          type: ActionType.SetTodos,
          payload: { todos: response },
        });
      })
      .catch(() => {
        dispatch({
          type: ActionType.ToggleError,
          payload: { errorType: ErrorType.LoadError },
        });
      });
  }, [state.userId]);

  useEffect(() => {
    const errorTimeout = setTimeout(() => {
      dispatch({
        type: ActionType.ToggleError,
        payload: { errorType: null },
      });
    }, 3000);

    return () => clearTimeout(errorTimeout);
  }, [state.error]);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};
