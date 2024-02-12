import React, { useEffect, useReducer } from 'react';
import { Todo } from '../../types/Todo';
import { getTodos } from '../../api/todos';

export enum Actions {
  addNew = 'addNew',
  mark = 'mark',
  destroy = 'destroy',
  edit = 'edit',
  destroyCompleted = 'destroyCompleted',
  setNewUserId = 'setNewUserId',
  setUserTodos = 'setUserTodos',
  setLoadingError = 'setLoadingError',
  setDeletingError = 'setDeletingError',
  setUpdatingError = 'setUpdatingError',
}

export enum Keys {
  Escape = 'Escape',
  Enter = 'Enter',
}

type Action = { type: Actions.addNew, todo: Todo }
| { type: Actions.mark, todo: Todo }
| { type: Actions.destroy, todo: Todo }
| { type: Actions.edit, todo: Todo }
| { type: Actions.destroyCompleted }
| { type: Actions.setNewUserId, userId: number }
| { type: Actions.setUserTodos, todos: Todo[] }
| { type: Actions.setLoadingError }
| { type: Actions.setDeletingError }
| { type: Actions.setUpdatingError };

interface State {
  userId: number,
  allTodos: Todo[],
  error: string,
}

function saveTodos(state: State, updatedTodos: Todo[]) {
  return {
    ...state,
    allTodos: updatedTodos,
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case Actions.mark: {
      const updatedTodos = state.allTodos.map((todo: Todo) => {
        return (todo.id === action.todo.id ? {
          ...todo,
          completed: !action.todo.completed,
        } : todo);
      });

      return saveTodos(state, updatedTodos);
    }

    case Actions.addNew: {
      const updatedTodos = [...state.allTodos, action.todo];

      return saveTodos(state, updatedTodos);
    }

    case Actions.destroy: {
      const updatedTodos = state.allTodos.filter((todo) => {
        return (action.todo.id !== todo.id);
      });

      return saveTodos(state, updatedTodos);
    }

    case Actions.edit: {
      const index = state.allTodos.findIndex(todo => {
        return todo.id === action.todo.id;
      });

      const updatedTodos = state.allTodos.map((todo, todoIndex) => {
        return (todoIndex === index ? {
          ...todo,
          title: action.todo.title,
        } : todo);
      });

      return saveTodos(state, updatedTodos);
    }

    case Actions.setNewUserId: {
      return {
        ...state,
        userId: action.userId,
      };
    }

    case Actions.setUserTodos: {
      return saveTodos(state, action.todos);
    }

    case Actions.setLoadingError: {
      return {
        ...state,
        error: 'Unable to load todos',
      };
    }

    case Actions.setDeletingError: {
      return {
        ...state,
        error: 'Unable to delete a todo',
      };
    }

    case Actions.setUpdatingError: {
      return {
        ...state,
        error: 'Unable to update a todo',
      };
    }

    default:
      return state;
  }
}

const initialState: State = {
  userId: 0,
  allTodos: [],
  error: '',
};

export const StateContext = React.createContext(initialState);
export const DispatchContext = React.createContext<React.Dispatch<Action>>(
  () => { },
);

interface Props {
  children: React.ReactNode,
}

export const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.userId) {
      getTodos(state.userId).then(todos => {
        dispatch({
          type: Actions.setUserTodos,
          todos,
        });
      }).catch(() => {
        dispatch({
          type: Actions.setLoadingError,
        });
      });
    }
  }, [state.userId]);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};
