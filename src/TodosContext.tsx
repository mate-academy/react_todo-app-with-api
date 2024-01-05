import React, { createContext, useEffect, useReducer } from 'react';
import { Todo } from './types/Todo';
import { ReducerType } from './types/enums/ReducerType';
import { Filter } from './types/enums/Filter';
import { Error } from './types/enums/Error';
import { getTodos } from './api/todos';
import { USER_ID } from './Variables';

interface Props {
  children: React.ReactNode
}

interface State {
  todos: Todo[]
  filter: Filter
  error: Error | null
  tempTodo: Todo | null
}

const initialState: State = {
  todos: [],
  filter: Filter.All,
  error: null,
  tempTodo: null,
};

type Action = { type: ReducerType.SetFilter, payload: Filter }
| { type: ReducerType.AddTodo, payload: Todo }
| { type: ReducerType.DeleteTodo, payload: number }
| { type: ReducerType.ClearCompletedTodos }
| { type: ReducerType.SetTodos, payload: Todo[] }
| { type: ReducerType.SetError, payload: Error | null }
| { type: ReducerType.SetTempTodo, payload: Todo | null }
| { type: ReducerType.ChangeTodo, payload: Todo };

const changeTodo = (todos: Todo[], todo: Todo): Todo[] => {
  return todos.map(i => (i.id === todo.id ? todo : i));
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ReducerType.SetTodos:
      return {
        ...state,
        todos: [...action.payload],
      };

    case ReducerType.AddTodo:
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };

    case ReducerType.SetFilter:
      return {
        ...state,
        filter: action.payload,
      };

    case ReducerType.DeleteTodo:
      return {
        ...state,
        todos: state.todos.filter(({ id }) => !(id === action.payload)),
      };

    case ReducerType.ClearCompletedTodos:
      return {
        ...state,
        todos: state.todos.filter(({ completed }) => !completed),
      };

    case ReducerType.SetError:
      return {
        ...state,
        error: action.payload,
      };

    case ReducerType.SetTempTodo:
      return {
        ...state,
        tempTodo: action.payload,
      };

    case ReducerType.ChangeTodo:
      return {
        ...state,
        todos: changeTodo(state.todos, action.payload),
      };

    default:
      return state;
  }
}

export const StateContext = createContext(initialState);
export const DispatchContext
  = createContext<(action: Action) => void>(() => {});

export const TodoStateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getTodos(USER_ID)
      .then((todos) => dispatch({
        type: ReducerType.SetTodos,
        payload: todos,
      }))
      .catch(() => dispatch({
        type: ReducerType.SetError,
        payload: Error.UnableToLoadTodos,
      }));
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};
