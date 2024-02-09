import React, {
  RefObject,
  SetStateAction,
  useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { Todo } from '../types/Todo';
import {
  createTodo, deleteTodo, getTodos, patchTodo,
} from '../api/todos';
import { ErrorMessages } from '../types/ErrorMessages';
import { Filters } from '../types/Filters';

const USER_ID = 11208;

type ContextValue = {
  filteredTodos: Todo[];
  todos: Todo[];
  loadingTodoId: number[];
  tempTodo: Todo | null;
  error: string | null;
  filter: Filters;
  nrOfActiveTodos: number;
  completedTodosId: number[];
  inputRef: RefObject<HTMLInputElement>;
  addTodo: (todo: string) => void;
  removeTodo: (id: number) => void;
  updateTodo: (
    itemId: number, data: Record<string, boolean | string>
  ) => Promise<void>;
  removeAllCompleted: () => void;
  changeErrorMessage: (message: string) => void;
  setError: React.Dispatch<SetStateAction<string | null>>;
  toggleAll: () => void;
  setFilter: React.Dispatch<SetStateAction<Filters>>;
};

export const TodoContext = React.createContext<ContextValue | null>(null);

type Props = React.PropsWithChildren;

export const TodoContextProvider = ({ children }: Props) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filters>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const changeErrorMessage = useCallback((message: string) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, 3000);
  }, []);

  useEffect(() => {
    getTodos(USER_ID)
      .then(data => {
        setTodos(data);
      })
      .catch(() => changeErrorMessage(ErrorMessages.DOWNLOAD));
  }, [changeErrorMessage]);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);

      case 'completed':
        return todos.filter(todo => todo.completed);

      case 'all':
      default:
        return todos;
    }
  }, [filter, todos]);

  const completedTodosId = useMemo(() => {
    return todos.filter(
      todo => todo.completed,
    ).reduce<number[]>((acc, next) => {
      return [...acc, next.id];
    }, []);
  }, [todos]);

  const focusOnInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const clearInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  const addTodo = useCallback((todo: string) => {
    const newTodo = {
      id: 0,
      title: todo,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(newTodo);

    createTodo(newTodo)
      .then(data => {
        setTodos(old => old.concat(data));
        clearInput();
        focusOnInput();
      })
      .catch(() => changeErrorMessage(ErrorMessages.ADD))
      .finally(() => {
        setTempTodo(null);
      });
  }, [changeErrorMessage, clearInput, focusOnInput]);

  const removeTodo = useCallback((itemId: number) => {
    setLoadingTodoId(prev => [...prev, itemId]);
    deleteTodo(itemId)
      .then(() => {
        setTodos(old => old.filter(todo => todo.id !== itemId));
      })
      .catch(() => changeErrorMessage(ErrorMessages.DELETE))
      .finally(
        () => {
          setLoadingTodoId(prev => prev.filter(id => id !== itemId));
          focusOnInput();
        },

      );
  }, [changeErrorMessage, focusOnInput]);

  const updateTodo = useCallback(async (
    itemId: number, data: Record<string, boolean | string>,
  ): Promise<void> => {
    setLoadingTodoId(prev => [...prev, itemId]);

    try {
      await patchTodo(itemId, data);

      setTodos(old => old.map(todo => {
        if (todo.id === itemId) {
          return {
            ...todo,
            ...data,
          };
        }

        return todo;
      }));

      setLoadingTodoId(prev => prev.filter(id => id !== itemId));
    } catch (err) {
      changeErrorMessage(ErrorMessages.UPDATE);
      setLoadingTodoId(prev => prev.filter(id => id !== itemId));
    }
  }, [changeErrorMessage]);

  const removeAllCompleted = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  }, [todos, removeTodo]);

  const nrOfActiveTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const toggleAll = useCallback(() => {
    const allActive = nrOfActiveTodos > 0;

    todos.forEach(todo => {
      updateTodo(todo.id, { completed: allActive });
    });
  }, [nrOfActiveTodos, todos, updateTodo]);

  const contextValue = {
    filteredTodos,
    todos,
    loadingTodoId,
    tempTodo,
    error,
    nrOfActiveTodos,
    completedTodosId,
    filter,
    inputRef,
    addTodo,
    removeTodo,
    updateTodo,
    removeAllCompleted,
    changeErrorMessage,
    setError,
    toggleAll,
    setFilter,
    isEditMode,
    setIsEditMode,
  };

  return (
    <TodoContext.Provider value={contextValue}>
      { children }
    </TodoContext.Provider>
  );
};

export const useTodoContext = () => {
  const value = useContext(TodoContext);

  if (value === null) {
    throw new Error('Context provider is missing');
  }

  return value;
};
