import React, { Dispatch, useReducer } from 'react';

interface State {
  isSavingTodo: boolean;
  isCreatingTodo: boolean;
  todoTitle: string;
  errorMessage: string;
  updatingTodoIds: string[];
}

interface Action {
  type: string,
  peyload: string,
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'startSave':
      return {
        ...state,
        isSavingTodo: true,
        updatingTodoIds: [...state.updatingTodoIds, action.peyload],
      };

    case 'finishSave':
      return {
        ...state,
        isSavingTodo: false,
        updatingTodoIds: [
          ...state.updatingTodoIds
            .filter((id) => id !== action.peyload),
        ],
      };

    case 'startCreate':
      return {
        ...state,
        isCreatingTodo: true,
      };

    case 'finishCreate':
      return {
        ...state,
        isCreatingTodo: false,
      };

    case 'setTitle':
      return {
        ...state,
        todoTitle: action.peyload,
      };

    case 'showError':
      return {
        ...state,
        errorMessage: action.peyload,
      };

    default:
      return state;
  }
};

const initialState = {
  isSavingTodo: false,
  isCreatingTodo: false,
  todoTitle: '',
  errorMessage: '',
  updatingTodoIds: [] as string[],
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
