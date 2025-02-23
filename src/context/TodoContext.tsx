import React, { createContext, useCallback, useState } from 'react';
import { deleteTodo, updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { Error } from '../types/Error';
import { TodosContextType } from '../types/TodosContextType';
import { Status } from '../types/Status';

export const TodosContext = createContext<TodosContextType | undefined>(
  undefined,
);

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState<Status>(Status.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleError = useCallback((message: string) => {
    setErrorMessage(message);

    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const toggleTodo = (todo: Todo) => {
    setLoadingTodosIds(currentIds => [...currentIds, todo.id]);

    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
    };

    updateTodo(updatedTodo)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        );
      })
      .catch(() => handleError(Error.updateTodo))
      .finally(() => {
        setLoadingTodosIds(currentIds =>
          currentIds.filter(id => id !== updatedTodo.id),
        );
      });
  };

  const removeTodo = (todoId: number): Promise<void> => {
    setLoadingTodosIds(currentIds => [...currentIds, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(item => item.id !== todoId),
        );
        setIsInputFocused(true);
      })
      .catch(() => {
        handleError(Error.deleteTodo);
      })
      .finally(() => {
        setLoadingTodosIds(currentIds =>
          currentIds.filter(id => id !== todoId),
        );
      });
  };

  const todosState = {
    todos,
    setTodos,
    query,
    setQuery,
    errorMessage,
    setErrorMessage,
    handleError,
    tempTodo,
    setTempTodo,
    loadingTodosIds,
    setLoadingTodosIds,
    isInputFocused,
    setIsInputFocused,
    toggleTodo,
    removeTodo,
  };

  return (
    <TodosContext.Provider value={todosState}>{children}</TodosContext.Provider>
  );
};
