import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { State } from '../types/State';
import { Action } from '../types/Action';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';
import { InitialContextData } from '../types/InitialContextData';
import * as todoService from '../api/todos';

// const savedData = localStorage.getItem('todos');

const initialState: State = {
  todos: [],
  tempTodo: null,
  filter: Filter.All,
  error: '',
  loadingItems: [],
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setTodos':
      return {
        ...state,
        todos: action.payload,
      };

    case 'addTodo':
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };

    case 'updateTodo':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? action.payload : todo,
        ),
      };

    case 'deleteTodo':
      return {
        ...state,
        todos: state.todos.filter((todo: Todo) => todo.id !== action.payload),
      };

    case 'setTempTodo':
      return {
        ...state,
        tempTodo: action.payload,
      };

    case 'setFilter':
      return {
        ...state,
        filter: action.payload,
      };

    case 'setError':
      return {
        ...state,
        error: action.payload,
      };

    case 'setLoadingItems':
      return {
        ...state,
        loadingItems: action.payload,
      };

    default:
      return state;
  }
};

const AppContext = createContext<InitialContextData>({
  state: initialState,
  setLoadingItems: () => {},
  setTodos: () => {},
  addTodo: () => new Promise(() => {}),
  updateTodo: () => new Promise(() => {}),
  deleteTodo: () => new Promise(() => {}),
  setTempTodo: () => {},
  setFilter: () => {},
  setError: () => {},
});

export const AppContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setTodos = (todos: Todo[]) => {
    dispatch({ type: 'setTodos', payload: todos });
  };

  const addTodo = (title: string) => {
    const newTodo = {
      userId: todoService.USER_ID,
      title,
      completed: false,
    };
    setLoadingItems([0]);
    setTempTodo({ ...newTodo, id: 0 });

    return todoService
      .addTodo(newTodo)
      .then(res => dispatch({ type: 'addTodo', payload: res }))
      .catch(error => {
        setError('Unable to add a todo');
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setLoadingItems([]);
      });
  };

  const updateTodo = (newTodo: Todo) => {
    return todoService
      .updateTodo(newTodo)
      .then(res => dispatch({ type: 'updateTodo', payload: res }))
      .catch(error => {
        setError('Unable to update a todo');
        throw error;
      });
  };

  const deleteTodo = (id: number) => {
    setError('');

    return todoService
      .deleteTodo(id)
      .then(() => dispatch({ type: 'deleteTodo', payload: id }))
      .catch(error => {
        setError('Unable to delete a todo');
        throw error;
      });
  };

  const setTempTodo = (todo: Todo | null) => {
    dispatch({ type: 'setTempTodo', payload: todo });
  };

  const setFilter = (filterType: Filter) => {
    dispatch({ type: 'setFilter', payload: filterType });
  };

  const setError = (errorMessage: string) => {
    dispatch({ type: 'setError', payload: errorMessage });
    setTimeout(() => dispatch({ type: 'setError', payload: '' }), 3000);
  };

  const setLoadingItems = (idList: number[]) => {
    dispatch({ type: 'setLoadingItems', payload: idList });
  };

  useEffect(() => {
    // if (!state.todos.length) {
    todoService
      .getTodos()
      .then(todos => {
        setTodos(todos);
        // localStorage.setItem('todos', JSON.stringify(fetchedData));
      })
      .catch(() => {
        setError('Unable to load todos');
      });
    // }

    // localStorage.setItem('todos', JSON.stringify(state.todos));
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        setLoadingItems,
        setTodos,
        addTodo,
        updateTodo,
        deleteTodo,
        setTempTodo,
        setFilter,
        setError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
