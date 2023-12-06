import React, { Reducer, useReducer, useState } from 'react';
import { ActionType } from '../../types/ActionType';
import { Todo } from '../../types/Todo';
import { Action } from '../../types/Action';

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.GetTodos: {
      return { todos: action.payload };
    }

    case ActionType.Delete: {
      const todos = state.todos.filter(todo => todo.id !== action.payload);

      return { todos };
    }

    case ActionType.Add: {
      const todos = [...state.todos, action.payload as Todo];

      return { ...state, todos };
    }

    case ActionType.SetCompleted: {
      const updatedTodos = state.todos.map(todo => {
        return todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo;
      });

      return { todos: updatedTodos };
    }

    case ActionType.EditTitle: {
      const { id, title } = action.payload;

      const renamedTodos = state.todos.map(todo => {
        return todo.id === id ? { ...todo, title } : todo;
      });

      return { todos: renamedTodos };
    }

    case ActionType.SetCompletedAll: {
      const newCompletedState = state.todos.every(todo => todo.completed);

      const newTodos = state.todos.map(todo => ({
        ...todo,
        completed: !newCompletedState,
      }));

      return { todos: newTodos };
    }

    case ActionType.ClearCompleted: {
      const todos = state.todos.filter(todo => !todo.completed);

      return { todos };
    }

    default:
      return state;
  }
}

type State = {
  todos: Todo[],
};

const initialState: State = {
  todos: [],
};

export const StateContext = React.createContext<State>(initialState);
export const DispatchContext = React
  .createContext<(action: Action) => void>(() => { });

type Props = {
  children: React.ReactNode;
};

export const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<State>(initialState);

  const [state, dispatch] = useReducer<Reducer<State, Action>>(reducer, todos);

  const dispatchAndSave = (action: Action) => {
    dispatch(action);
    setTodos((prevState: State) => reducer(prevState, action));
  };

  return (
    <DispatchContext.Provider value={dispatchAndSave}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};
