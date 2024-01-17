import React, { createContext, useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { Errors } from '../types/Errors';
import * as postServise from '../api/todos';
import { Filter } from '../types/Filter';
import { filterTodo } from '../utils/filterFunc';
import { TodoContextType } from '../types/TodoContextType';

const USER_ID = 12047;

export const TodosContext = createContext<TodoContextType>({
  todos: [],
  setTodos: () => {},
  error: null,
  setError: () => {},
  removeTodo: () => {},
  filterType: Filter.All,
  setFilterType: () => {},
  filteredTodo: [],
  userId: USER_ID,
});

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [filterType, setFilterType] = useState<Filter>(Filter.All);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Errors | null>(null);
  const filteredTodo = filterTodo(todos, filterType);

  const removeTodo = async (todoId: number) => {
    try {
      await postServise.deleteTodo(todoId);
    } catch (removeError) {
      setError(Errors.UNABLE_DELETE);
    }

    setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const todosFromServer = await postServise.getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch {
        setError(Errors.UNABLE);
      }
    };

    getData();
  }, []);

  const value = {
    todos,
    setTodos,
    error,
    setError,
    removeTodo,
    setFilterType,
    filteredTodo,
    filterType,
    userId: USER_ID,
  };

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
