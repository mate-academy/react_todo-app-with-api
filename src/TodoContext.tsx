/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */

import React, { useEffect, useState } from 'react';
import { State, Todo, TodoContextProps } from './types/interfaces';
import { ErrorMessages, Filter } from './types/enum';
import {
  deleteTodo,
  getTodos,
  patchTodo,
  postTodo,
} from './api/todos';
import { USER_ID } from './utils/consts';
import { UserWarning } from './UserWarning';

export type AppContextProps = {
  children: React.ReactNode
};

const initialState: TodoContextProps = {
  state: {
    todos: [],
    filter: Filter.All,
  },
  setState: () => {},
  handleCheck: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  handleDeleteTodo: () => {},
  deleteAllCompleted: () => {},
  setTodosIsLoading: () => {},
  todosIsLoading: [],
  handleEditTodo: () => {},
  error: null,
  setError: () => {},
  isEditing: null,
  setIsEditing: () => {},
  handleCheckAll: () => {},
};

export const GlobalContext = React.createContext<TodoContextProps>(initialState);

export const AppContext: React.FC<AppContextProps> = ({ children }) => {
  const [state, setState] = useState<State>({
    todos: [],
    filter: Filter.All,
  });

  const [error, setError] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosIsLoading, setTodosIsLoading] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);

  const removeLoading = (todoId: number) => {
    setTodosIsLoading((prev) => [...prev.filter(id => id !== todoId)]);
  };

  useEffect(() => {
    if (tempTodo) {
      postTodo(tempTodo)
        .then(todo => {
          setState(prev => ({
            ...prev,
            todos: [...prev.todos, todo],
          }));
        })
        .then(() => {
          setTempTodo(null);
        })
        .catch(() => {
          setError(ErrorMessages.AddFail);
          setTempTodo(null);
        });
    }
  }, [tempTodo]);

  useEffect(() => {
    getTodos(USER_ID)
      .then((todos) => {
        setState((prev) => ({
          ...prev,
          todos,
        }));
      })
      .catch(() => {
        setError(ErrorMessages.LoadFail);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function handleCheck(todo: Todo) {
    const checkTodo = { ...todo };

    checkTodo.completed = !todo.completed;

    function replaceTodo(prevState: State, patchedTodo: Todo) {
      prevState.todos.splice(prevState.todos.indexOf(todo), 1, patchedTodo);

      return prevState.todos;
    }

    patchTodo(checkTodo)
      .then(patchedTodo => {
        setState(prev => ({
          ...prev,
          todos: replaceTodo(prev, patchedTodo),
        }));
        removeLoading(checkTodo.id);
      })
      .catch(() => {
        removeLoading(checkTodo.id);
        setError(ErrorMessages.UpdateFail);
      });
  }

  const handleCheckAll = () => {
    const uncompletedTodo = [...state.todos.filter(todo => todo.completed === false)];

    if (uncompletedTodo.length > 0) {
      setTodosIsLoading(prev => (
        [...prev, ...uncompletedTodo.map(todoId => todoId.id)]
      ));

      for (const todo of uncompletedTodo) {
        handleCheck(todo);
      }
    } else {
      setTodosIsLoading(prev => (
        [...prev, ...state.todos.map(todoId => todoId.id)]
      ));

      for (const todo of state.todos) {
        handleCheck(todo);
      }
    }
  };

  function handleDeleteTodo(todo: Todo) {
    deleteTodo(todo.id)
      .then(() => {
        setState((prev) => ({
          ...prev,
          todos: [...prev.todos.filter((currTodo) => currTodo.id !== todo.id)],
        }));
        removeLoading(todo.id);
        setIsEditing(null);
      })
      .catch(() => {
        removeLoading(todo.id);
        setError(ErrorMessages.DeleteFail);
      });
  }

  function deleteAllCompleted() {
    const completedTodo = [...state.todos.filter(todo => todo.completed)];

    setTodosIsLoading(prev => (
      [...prev, ...completedTodo.map(todoId => todoId.id)]
    ));

    for (const todo of completedTodo) {
      handleDeleteTodo(todo);
    }
  }

  function handleEditTodo(todo: Todo, newTitle: string) {
    const editTodo = { ...todo };

    editTodo.title = newTitle;

    function replaceTodo(prevState: State, patchedTodo: Todo) {
      prevState.todos.splice(prevState.todos.indexOf(todo), 1, patchedTodo);

      return prevState.todos;
    }

    patchTodo(editTodo)
      .then(patchedTodo => {
        setState(prev => ({
          ...prev,
          todos: replaceTodo(prev, patchedTodo),
        }));
        removeLoading(editTodo.id);
        setIsEditing(null);
      })
      .catch(() => {
        removeLoading(editTodo.id);
        setError(ErrorMessages.UpdateFail);
      });
  }

  const contextValue: TodoContextProps = {
    state,
    setState,
    handleCheck,
    tempTodo,
    handleDeleteTodo,
    deleteAllCompleted,
    setTodosIsLoading,
    todosIsLoading,
    handleEditTodo,
    error,
    isEditing,
    setIsEditing,
    setTempTodo,
    setError,
    handleCheckAll,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};
