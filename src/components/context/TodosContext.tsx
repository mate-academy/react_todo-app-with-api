import React, { useContext, useEffect, useMemo, useState } from 'react';

import * as todosServices from '../../api/api';
import { useError } from './ErrorContext';
import { Status, TodoError } from '../../types/enums';
import { Todo } from '../../types/Todo';

interface TodosContextType {
  todos: Todo[];
  statusTodo: Status;
  tempTodo: Todo | null;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setTempTodo: (_todo: Todo) => void;
  removeTodo: (_todoId: number) => Promise<void>;
  updateTodo: (_updatedTodo: Todo) => Promise<void>;
  addTodo: (_todo: Todo) => Promise<void>;
  handleCheck: (_updatedTodo: Todo) => void;
  handleClearCompleted: () => Promise<void>;
  toggleAll: () => void;
  setStatusTodo: (_statusTodo: Status) => void;
}

const contextValue = {
  todos: [],
  statusTodo: Status.All,
  tempTodo: null,
  isLoading: false,
  setIsLoading: () => {},
  setTempTodo: () => {},
  removeTodo: async () => {},
  updateTodo: async () => {},
  addTodo: async () => {},
  handleCheck: async () => {},
  handleClearCompleted: async () => {},
  toggleAll: () => {},
  setStatusTodo: () => {},
};

export const TodosContext = React.createContext<TodosContextType>(contextValue);

interface Props {
  children: React.ReactNode;
}

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [statusTodo, setStatusTodo] = useState(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { setErrorMessage } = useError();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const fetchedTodos = await todosServices.getTodos();

        setTodos(fetchedTodos);
      } catch (error) {
        setErrorMessage(TodoError.UnableToLoad);
      }
    };

    fetchTodos();
  }, [setErrorMessage]);

  const addTodo = async ({ title, completed, userId }: Todo) => {
    setErrorMessage(null);

    setTempTodo({
      id: 0,
      title,
      userId,
      completed: false,
    });

    try {
      const newTodo = await todosServices.postTodos({
        title,
        completed,
        userId,
      });

      setTempTodo(null);
      setTodos(currTodos => [...currTodos, newTodo]);
    } catch (error) {
      setErrorMessage(TodoError.UnableToAdd);
      setTempTodo(null);
      throw error;
    } finally {
      setTempTodo(null);
    }
  };

  const removeTodo = async (todoId: number) => {
    setIsLoading(true);
    try {
      await todosServices.deleteTodos(todoId);
      setTodos(currTodos => currTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage(TodoError.UnableToDelete);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTodo = async (updatedTodo: Todo) => {
    try {
      const todoEdited = await todosServices.updateTodo(updatedTodo);

      setTodos(currTodos =>
        currTodos.map(todo => (todo.id === updatedTodo.id ? todoEdited : todo)),
      );
    } catch (error) {
      setErrorMessage(TodoError.UnableUpdate);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheck = async (updatedTodo: Todo) => {
    setIsLoading(true);
    try {
      await updateTodo({ ...updatedTodo, completed: !updatedTodo.completed });
    } catch (error) {
      setErrorMessage(TodoError.UnableUpdate);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const activeTodos = todos.filter(todo => !todo.completed);
    const completedTodos = todos.filter(todo => todo.completed);
    const todosToToggle = allCompleted ? completedTodos : activeTodos;
    const togglePromise = todosToToggle.map(todo =>
      todosServices.updateTodo({
        ...todo,
        completed: !allCompleted,
      }),
    );

    setIsLoading(true);

    try {
      setIsLoading(true);

      await Promise.all(togglePromise);
      setTodos(
        todos.map(todo => ({
          ...todo,
          completed: !allCompleted,
        })),
      );
    } catch (error) {
      setErrorMessage(TodoError.UnableUpdate);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const failedDeletions: Todo[] = [];

    for (const todo of completedTodos) {
      try {
        await todosServices.deleteTodos(todo.id);
        setIsLoading(false);
      } catch (error) {
        setTodos(todos);
        failedDeletions.push(todo);
        setErrorMessage(TodoError.UnableToDelete);
      }
    }

    if (failedDeletions.length === 0) {
      setTodos(todos.filter(todo => !todo.completed));
    } else {
      setTodos(
        todos.filter(
          todo =>
            !completedTodos.includes(todo) || failedDeletions.includes(todo),
        ),
      );
      setErrorMessage(TodoError.UnableToDelete);
    }
  };

  const contextValueMemo = useMemo(
    () => ({
      todos,
      statusTodo,
      tempTodo,
      isLoading,
      setIsLoading,
      setTempTodo,
      removeTodo,
      addTodo,
      updateTodo,
      handleCheck,
      handleClearCompleted,
      toggleAll,
      setStatusTodo,
    }),
    [todos, statusTodo, tempTodo],
  );

  return (
    <TodosContext.Provider value={contextValueMemo}>
      {children}
    </TodosContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodosContext);

  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }

  return context;
};
