import React, { Dispatch, useReducer } from 'react';

interface State {
  isSavingTodo: boolean;
  todoTitle: string;
}

interface Action {
  type: 'startSave' | 'finishSave' | 'setTitle',
  peyload: string,
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'startSave':
      return {
        ...state,
        isSavingTodo: true,
      };

    case 'finishSave':
      return {
        ...state,
        isSavingTodo: false,
      };

    case 'setTitle':
      return {
        ...state,
        todoTitle: action.peyload,
      };

    default:
      return state;
  }
};

const initialState = {
  isSavingTodo: false,
  todoTitle: '',
};

export const DispatchContext = React.createContext<Dispatch<Action>>(() => {});
export const StateContext = React.createContext(initialState);

interface Props {
  children?: React.ReactNode;
}

export const StateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
  );

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};
