import React, { createContext, useEffect, useState } from 'react';

import { Todo } from '../types/Todo';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from '../api/todos';
import { USER_ID } from '../utils/constants';

interface TodoContextProps {
  todos: Todo[];
  handleAddTodo: (todo: Omit<Todo, 'id'>) => Promise<void>;
  handleDeleteTodo: (todoId: number) => Promise<void>;
  handleUpdateTodo: (todo: Todo, property: Partial<Todo>) => Promise<void>;
  errorMessage: string;
  setErrorMessage: (str: string) => void;
  isLoadingTodoIds: number[];
}

export const TodoContext = createContext<TodoContextProps>({
  todos: [],
  handleAddTodo: async () => { },
  handleDeleteTodo: async () => { },
  handleUpdateTodo: async () => { },
  errorMessage: '',
  setErrorMessage: () => { },
  isLoadingTodoIds: [],
});

type TodoProviderProps = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingTodoIds, setIsLoadingTodoIds] = useState<number[]>([]);

  const handleAddTodo = async (
    newTodo: Omit<Todo, 'id'>,
  ) => {
    try {
      const createdTodo = await addTodo(newTodo);

      setTodos((currentTodos) => [...currentTodos, createdTodo]);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      throw new Error();
    }
  };

  const handleUpdateTodo = async (
    todo: Todo,
    propertiesToUpdate: Partial<Todo>,
  ) => {
    setIsLoadingTodoIds(prevLoadingTodoIds => ([
      ...prevLoadingTodoIds,
      todo.id,
    ]));
    try {
      const updatedTodo = await updateTodo(todo.id, {
        ...todo,
        ...propertiesToUpdate,
      });

      setTodos((currentTodos: Todo[]) => {
        return currentTodos.map((currentTodo) => {
          return currentTodo.id === updatedTodo.id
            ? updatedTodo
            : currentTodo;
        }) as Todo[];
      });
    } catch (error) {
      setErrorMessage('Unable to update todo');
    }

    setIsLoadingTodoIds(prevLoadingTodos => prevLoadingTodos.filter(
      id => todo.id !== id,
    ));
  };

  const handleDeleteTodo = async (todoId: number) => {
    setIsLoadingTodoIds(prevLoadingTodoIds => ([
      ...prevLoadingTodoIds,
      todoId,
    ]));

    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(({ id }) => id !== todoId));
    } catch {
      setErrorMessage('Unable to delete a todo');
    }

    setIsLoadingTodoIds(prevLoadingTodos => prevLoadingTodos.filter(
      id => todoId !== id,
    ));
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  return (
    <TodoContext.Provider
      value={{
        todos,
        handleAddTodo,
        handleDeleteTodo,
        handleUpdateTodo,
        setErrorMessage,
        errorMessage,
        isLoadingTodoIds,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
