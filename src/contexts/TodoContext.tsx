import React, { useReducer } from 'react';
import { Todo } from '../types/Todo';
import { ActionType, Actions } from './types/Actions';

export interface TodoState {
  todos: Todo[];
  dispatch: React.Dispatch<Actions>;
}

export const TodoContext = React.createContext<TodoState>({
  todos: [],
  dispatch: () => {},
});

const reducer = (state: Todo[], action: Actions): Todo[] => {
  switch (action.type) {
    case ActionType.GET: {
      return state;
    }

    case ActionType.ADD: {
      return [...state, action.payload];
    }

    case ActionType.DELETE: {
      return [...state.filter(x => x.id !== action.payload)];
    }

    case ActionType.COMPLETED: {
      const ind = state.findIndex(x => x.id === action.payload.id);

      return [
        ...state.slice(0, ind),
        { ...action.payload },
        ...state.slice(ind + 1, state.length),
      ];
    }

    case ActionType.EDITED: {
      const ind = state.findIndex(x => x.id === action.payload.id);

      return [
        ...state.slice(0, ind),
        { ...action.payload },
        ...state.slice(ind + 1, state.length),
      ];
    }

    case ActionType.SET: {
      return [...action.payload];
    }

    default: {
      return state;
    }
  }
};

export const TodoContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [todos, dispatch] = useReducer(reducer, []);

  return (
    <TodoContext.Provider
      value={{
        todos: todos,
        dispatch: dispatch,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
