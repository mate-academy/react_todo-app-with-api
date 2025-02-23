import React, { useReducer } from 'react';
import { statusReducer, todosReducer } from './Reducers';
import { Todo } from '../types/Todo';
import { TodoAction } from '../types/TodoActions';
import { StatusAction } from '../types/StatusAction';
import { Status } from '../types/Status';

interface State {
  todos: Todo[];
  status: string;
}

const initialState: State = {
  todos: [],
  status: Status.All,
};

type ActionTypes = TodoAction | StatusAction;

export const StateContext = React.createContext(initialState);
export const DispatchContext = React.createContext<React.Dispatch<ActionTypes>>(
  () => null,
);

const mainReducer = ({ todos, status }: State, action: ActionTypes) => ({
  todos: todosReducer(todos, action as TodoAction),
  status: statusReducer(status, action as StatusAction),
});

type Props = {
  children: React.ReactNode;
};

export const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(mainReducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};
