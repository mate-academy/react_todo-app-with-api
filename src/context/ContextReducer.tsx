/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useReducer } from 'react';
import { Todo } from '../types/Todo';
import {
  USER_ID,
  addTodo,
  deleteTodo,
  getTodos,
  updateTodoCompleted,
  updateTodoTitle,
} from '../api/todos';

export type Action =
  | { type: 'setTodoApi'; payload: Todo[] }
  | { type: 'setTotalLenght'; payload: Todo[] }
  | { type: 'setError'; error: string }
  | { type: 'setQuery'; value: string }
  | { type: 'addTodo' }
  | { type: 'setSelect'; value: string }
  | { type: 'setFetch'; value: boolean }
  | { type: 'deleteTodo'; currentId: number }
  | { type: 'disableFetch' }
  | { type: 'setComplate'; currentId: number; currentComplate: boolean }
  | { type: 'setEdit'; currentId: number; currentTitle: string }
  | { type: 'setNewTitle'; value: string; currentId: number }
  | { type: 'submitNewTitile'; currentId: number; currentTitle: string }
  | { type: 'setAllCompleted'; currentComleted: boolean }
  | { type: 'deleteAllCompleted' }
  | { type: 'escape' }
  | { type: 'setSignal' }
  | { type: 'setAll' }
  | { type: 'setActive' }
  | { type: 'setCompleted' };

interface State {
  totalLength: Todo[];
  todoApi: Todo[];
  select: string;
  error: string;
  query: string;
  fetch: boolean;
  currentId: number;
  prevTitle: string;
  showError: string;
  todoLoading: Record<number, boolean>;
  allTodoLoading: boolean;
  addItem: boolean;
  focus: boolean;
  newTodo: Omit<Todo, 'id'>;
  currentTitle: string;
  currentedCompleted: boolean;

  updatingTodo: boolean;
  setComplate: boolean;
  signal: boolean;
  deleteTodo: boolean;
  createTodo: boolean;
  updatingTitleTodo: boolean;
  selectedAll: boolean;
  deleteAll: boolean;
}

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'setTodoApi':
      return {
        ...state,
        todoApi: action.payload,
      };

    case 'setTotalLenght':
      return {
        ...state,
        totalLength: action.payload,
      };

    case 'setError':
      return {
        ...state,
        showError: action.error,
      };

    case 'setQuery':
      return {
        ...state,
        query: action.value,
        newTodo: {
          userId: USER_ID,
          title: action.value,
          completed: false,
        },
      };

    case 'addTodo':
      if (!state.query.trim()) {
        return {
          ...state,
          fetch: true,
          showError: 'Title should not be emptys',
        };
      }

      return {
        ...state,
        query: '',
        fetch: true,
        error: 'Unable to add a todo',
        addItem: true,
        signal: !state.signal,
      };

    case 'setSignal':
      return {
        ...state,
        signal: !state.signal,
      };

    case 'setSelect':
      return {
        ...state,
        select: action.value,
      };

    case 'setFetch':
      return {
        ...state,
        fetch: action.value,
      };

    case 'deleteTodo':
      return {
        ...state,
        currentId: action.currentId,
        fetch: true,
        error: 'Unable to delete a todo',
        todoLoading: {
          ...state.todoLoading,
          [action.currentId]: true,
        },
        deleteTodo: true,
        signal: !state.signal,
      };

    case 'disableFetch':
      return {
        ...state,
        fetch: false,
        todoLoading: {
          [state.currentId]: false,
        },
        allTodoLoading: false,
        addItem: false,
        focus: true,
        prevTitle: '',
        currentTitle: '',
        selectedAll: false,
        deleteAll: false,
        updatingTodo: false,
        deleteTodo: false,
        updatingTitleTodo: false,
      };

    case 'setComplate':
      return {
        ...state,
        currentId: action.currentId,
        fetch: true,
        error: 'Unable to update a todo',
        todoLoading: {
          [action.currentId]: true,
        },
        updatingTodo: true,
        setComplate: action.currentComplate ? false : true,
        signal: !state.signal,
      };

    case 'setEdit':
      return {
        ...state,
        currentId: action.currentId,
        currentTitle: action.currentTitle,
        focus: false,
      };

    case 'setNewTitle':
      return {
        ...state,
        currentId: action.currentId,
        prevTitle: action.value,
      };

    case 'escape':
      updateTodoTitle({
        id: state.currentId,
        title: state.currentTitle,
      });

      return {
        ...state,
        currentId: 0,
        prevTitle: '',
      };

    case 'submitNewTitile':
      if (!state.prevTitle) {
        return {
          ...state,
          fetch: true,
          currentId: 0,
          prevTitle: '',
        };
      }

      if (state.prevTitle !== action.currentTitle && state.prevTitle) {
        return {
          ...state,
          fetch: true,
          currentId: action.currentId,
          error: 'Unable to update a todo',
          todoLoading: {
            [state.currentId]: true,
          },
          updatingTitleTodo: true,
          signal: !state.signal,
        };
      }

      return state;

    case 'setAllCompleted':
      return {
        ...state,
        fetch: true,
        error: 'Unable to update a todo',
        allTodoLoading: true,
        selectedAll: true,
        currentedCompleted: action.currentComleted ? false : true,
        signal: !state.signal,
      };

    case 'deleteAllCompleted':
      return {
        ...state,
        fetch: true,
        error: 'Unable to delete a todo',
        allTodoLoading: true,
        deleteAll: true,
        signal: !state.signal,
      };

    default:
      return state;
  }
};

const initialState: State = {
  totalLength: [],
  todoApi: [],
  select: 'All',
  selectedAll: false,
  error: '',
  showError: '',
  query: '',
  fetch: false,
  currentId: 0,
  prevTitle: '',
  todoLoading: {
    [0]: false,
  },
  allTodoLoading: false,
  addItem: false,
  focus: true,
  newTodo: {
    userId: USER_ID,
    title: '',
    completed: false,
  },
  currentTitle: '',
  currentedCompleted: false,
  deleteAll: false,

  updatingTodo: false,
  setComplate: false,
  signal: false,
  deleteTodo: false,
  createTodo: false,
  updatingTitleTodo: false,
};

export const StateContext = React.createContext(initialState);
export const DispatchContext = React.createContext((_action: Action) => {});

interface Props {
  children: React.ReactNode;
}

export const GlobalProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const deleteAfterShowError = () => {
    setTimeout(() => dispatch({ type: 'setError', error: '' }), 3000);
  };

  const postAction = (t: Todo[]) => {
    dispatch({ type: 'setTodoApi', payload: t });
    dispatch({ type: 'setTotalLenght', payload: t });
    dispatch({ type: 'disableFetch' });
  };

  const error =
    state.showError === 'Title should not be emptys'
      ? 'Title should not be emptys'
      : state.error;

  useEffect(() => {
    if (state.selectedAll) {
      state.todoApi.map(todo => {
        updateTodoCompleted({
          id: todo.id,
          completed: state.currentedCompleted,
        })
          .then(() => {
            const selectedAll = state.todoApi.map(t => {
              return {
                ...t,
                completed: state.currentedCompleted,
              };
            });

            postAction(selectedAll);
          })
          .catch(() => {
            dispatch({ type: 'setError', error: error });
          })
          .finally(() => deleteAfterShowError());
      });
    } else if (state.deleteAll) {
      state.todoApi.map(todo => {
        if (todo.completed) {
          deleteTodo(todo.id)
            .then(() => {
              const afterTodoDelete = state.todoApi.filter(t => !t.completed);

              postAction(afterTodoDelete);
            })
            .catch(() => {
              dispatch({ type: 'setError', error: error });
            })
            .finally(() => deleteAfterShowError());
        }
      });
    } else if (state.updatingTitleTodo) {
      updateTodoTitle({
        id: state.currentId,
        title: state.prevTitle,
      })
        .then(() => {
          const updatedTodosTitle = state.todoApi.map(todo => {
            if (todo.id === state.currentId) {
              return {
                ...todo,
                title: state.prevTitle,
              };
            }

            return todo;
          });

          postAction(updatedTodosTitle);
        })
        .catch(() => {
          dispatch({ type: 'setError', error: error });
        })
        .finally(() => deleteAfterShowError());
    } else if (state.addItem) {
      addTodo(state.newTodo)
        .then(todo => {
          const newTodoApi = [...state.todoApi, todo];

          postAction(newTodoApi);
        })
        .catch(() => {
          dispatch({ type: 'setError', error: error });
        })
        .finally(() => deleteAfterShowError());
    } else if (state.deleteTodo) {
      deleteTodo(state.currentId)
        .then(() => {
          const updatedTodosDelete = state.todoApi.filter(
            todo => todo.id !== state.currentId,
          );

          postAction(updatedTodosDelete);
        })
        .catch(() => {
          dispatch({ type: 'setError', error: error });
        })
        .finally(() => deleteAfterShowError());
    } else if (state.updatingTodo) {
      updateTodoCompleted({
        id: state.currentId,
        completed: state.setComplate,
      })
        .then(() => {
          const updatedTodos = state.todoApi.map(todo => {
            if (todo.id === state.currentId) {
              return {
                ...todo,
                completed: state.setComplate,
              };
            }

            return todo;
          });

          postAction(updatedTodos);
        })
        .catch(() => {
          dispatch({ type: 'setError', error: error });
        })
        .finally(() => deleteAfterShowError());
    } else {
      getTodos()
        .then(todos => {
          dispatch({ type: 'setTodoApi', payload: todos });
          dispatch({ type: 'setTotalLenght', payload: todos });
        })
        .catch(() => {
          dispatch({ type: 'setError', error: error });
        })
        .finally(() => deleteAfterShowError());
    }
  }, [state.signal]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};
