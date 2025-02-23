/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { ErrorMessages, Todo } from '../types/Todo';
import * as todoService from '../../src/api/todos';

type ContextType = {
  error: ErrorMessages | null;
  tempTodo: Todo | null;
  setTempTodo: (todo: Todo | null) => void;
  setError: (value: ErrorMessages | null) => void;
  displayError: (message: ErrorMessages) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  activeTodoIds: Array<Todo['id']>;
  setActiveTodoIds: (todos: Array<Todo['id']>) => void;
  handleDeleteTodo: (todo: Todo) => void;
  toggleTodo: (todo: Todo) => void;
  renameTodo: (todo: Todo, newTitle: string) => Promise<void>;
};

// export const TodoContext = React.createContext<ContextType | null>(null);

export const TodoContext = React.createContext<ContextType>({
  error: null,
  setError: (_value: ErrorMessages | null) => {},
  displayError: (_message: ErrorMessages) => {},
  tempTodo: null,
  setTempTodo: (_todo: Todo | null) => {},
  isLoading: false,
  setIsLoading: (_value: boolean) => {},
  todos: [],
  setTodos: () => [],
  activeTodoIds: [],
  setActiveTodoIds: (_todos: Array<Todo['id']>) => {},
  handleDeleteTodo: (_todo: Todo) => {},
  toggleTodo: (_todo: Todo) => {},
  renameTodo: (_todo: Todo, _newTitle: string) => new Promise(() => {}),
});

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [error, setError] = useState<ErrorMessages | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTodoIds, setActiveTodoIds] = useState<Array<Todo['id']>>([]);

  const displayError = useCallback(
    (message: ErrorMessages) => {
      setError(message);
      setTimeout(() => {
        setError(null);
      }, 3000);
    },
    [setError],
  );

  const toggleTodo = (todoToUpdate: Todo) => {
    setActiveTodoIds(currentTodos => [...currentTodos, todoToUpdate.id]);
    todoService
      .updateTodo({
        ...todoToUpdate,
        completed: !todoToUpdate.completed,
      })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(item =>
            item.id === updatedTodo.id ? updatedTodo : item,
          ),
        );
      })
      .catch(() => displayError(ErrorMessages.UpdateTodo))
      .finally(() => {
        setActiveTodoIds([]);
      });
  };

  const handleDeleteTodo = (todo: Todo) => {
    setIsLoading(true);
    setActiveTodoIds([todo.id]);
    todoService
      .deleteTodo(todo.id)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(item => item.id !== todo.id),
        ),
      )
      .catch(() => displayError(ErrorMessages.DeleteTodo))
      .finally(() => {
        setActiveTodoIds([]);
        setIsLoading(false);
      });
  };

  const renameTodo = (todoToRename: Todo, newTitle: string) => {
    setActiveTodoIds(currentTodos => [...currentTodos, todoToRename.id]);

    return todoService
      .updateTodo({
        ...todoToRename,
        title: newTitle,
      })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(item =>
            item.id === updatedTodo.id ? updatedTodo : item,
          ),
        );
      })
      .catch(updateError => {
        displayError(ErrorMessages.UpdateTodo);
        throw updateError;
      })
      .finally(() => {
        setActiveTodoIds(currentTodos =>
          currentTodos.filter(id => id !== todoToRename.id),
        );
      });
  };

  const value = {
    error,
    setError,
    displayError,
    tempTodo,
    setTempTodo,
    isLoading,
    setIsLoading,
    todos,
    setTodos,
    setActiveTodoIds,
    activeTodoIds,
    handleDeleteTodo,
    toggleTodo,
    renameTodo,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
