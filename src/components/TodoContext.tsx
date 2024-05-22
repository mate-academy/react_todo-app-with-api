import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { Todo } from '../types/Todo';
import { getTodos } from '../api/todos';

export enum FilterBy {
  All = 'ALL',
  Active = 'ACTIVE',
  Completed = 'COMPLETED',
}

export type FilterAction = FilterBy.All | FilterBy.Active | FilterBy.Completed;

type TodoContextType = {
  todos: Todo[];
  originalTodos: Todo[];
  dispatch: (action: Action) => void;
  filteredBy: FilterBy;
  setFilteredBy: (type: FilterBy) => void;
  error: string | null;
  handleError: (message: string) => void;
  tmpTodo: Todo | null;
  handleTmpTodo: (todo: Todo | null) => void;
  loading: number[];
  handleLoading: (ids: number[]) => void;
};

export const TodoContext = React.createContext<TodoContextType>({
  todos: [],
  originalTodos: [],
  dispatch: () => {},
  filteredBy: FilterBy.All,
  setFilteredBy: () => {},
  error: null,
  handleError: () => {},
  tmpTodo: null,
  handleTmpTodo: () => {},
  loading: [],
  handleLoading: () => {},
});

export type Props = {
  children: React.ReactNode;
};

export enum ActionNames {
  Load = 'LOAD',
  Add = 'ADD',
  Delete = 'DELETE',
  Update = 'UPDATE',
  Completed = 'TOGGLE_COMPLETED',
  ToggleAllCompleted = 'TOGGLE_ALL_COMPLETED',
  ClearCompleted = 'CLEAR_COMPLETED',
}

export type Action =
  | { type: ActionNames.Load; payload: Todo[] }
  | { type: ActionNames.Add; payload: Todo }
  | { type: ActionNames.Delete; payload: number }
  | { type: ActionNames.Update; payload: { id: number; title: string } }
  | { type: ActionNames.Completed; payload: { id: number; completed: boolean } }
  | { type: ActionNames.ToggleAllCompleted }
  | { type: ActionNames.ClearCompleted };

export const errors = {
  LoadTodos: 'Unable to load todos',
  EmptyTitle: 'Title should not be empty',
  AddTodo: 'Unable to add a todo',
  DeleteTodo: 'Unable to delete a todo',
  UpdateTodo: 'Unable to update a todo',
};

function reducer(state: Todo[], action: Action) {
  switch (action.type) {
    case ActionNames.Load:
      return action.payload;

    case ActionNames.Add:
      return [...state, action.payload];

    case ActionNames.Delete:
      return state.filter(todo => todo.id !== action.payload);

    case ActionNames.Update:
      return state.map((todo: Todo) => {
        if (todo.id === action.payload.id) {
          return {
            ...todo,
            title: action.payload.title.trim(),
          };
        }

        return todo;
      });

    case ActionNames.Completed:
      return state.map(todo => {
        if (todo.id === action.payload.id) {
          return {
            ...todo,
            completed: !todo.completed,
          };
        }

        return todo;
      });

    case ActionNames.ToggleAllCompleted:
      const completed = state.some(todo => todo.completed === false);

      return state.map(todo => {
        return {
          ...todo,
          completed: completed,
        };
      });

    case ActionNames.ClearCompleted:
      return state.filter(todo => !todo.completed);

    default:
      return state;
  }
}

function filter(todos: Todo[], type: FilterAction) {
  switch (type) {
    case FilterBy.Active:
      return todos.filter(todo => !todo.completed);

    case FilterBy.Completed:
      return todos.filter(todo => todo.completed);

    case FilterBy.All:
    default:
      return todos;
  }
}

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, dispatch] = useReducer(reducer, []);
  const [tmpTodo, setTmpTodo] = useState<Todo | null>(null);
  const [filteredBy, setFilteredBy] = useState<FilterBy>(FilterBy.All);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<number[]>([]);

  const handleError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 3000);
  };

  const handleTmpTodo = (todo: Todo | null) => {
    setTmpTodo(todo);
  };

  const handleLoading = (ids: number[]) => {
    setLoading(ids);
  };

  const value = useMemo(
    () => ({
      todos: filter(todos, filteredBy),
      originalTodos: todos,
      dispatch,
      filteredBy,
      setFilteredBy,
      error,
      handleError,
      tmpTodo,
      handleTmpTodo,
      loading,
      handleLoading,
    }),
    [todos, dispatch, filteredBy, setFilteredBy, error, tmpTodo, loading],
  );

  useEffect(() => {
    getTodos()
      .then(loadedTodos =>
        dispatch({ type: ActionNames.Load, payload: loadedTodos }),
      )
      .catch(() => {
        handleError(errors.LoadTodos);
      });
  }, []);

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
