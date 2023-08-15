/*eslint-disable*/
import React, { createContext, useEffect, useState } from "react";
import { USER_ID } from "../App";
import { deleteTodo, getTodos, patchTodo, postTodo } from "../api/todos";
import { Todo } from "../types/Todo";
import { ERRORS } from "../types/TodosErrors";
import { SORT } from "../types/SortEnum";
import { IContext } from "../types/IContext";

export const TodosContext = createContext<IContext>({
  todos: [],
  error: ERRORS.NONE,
  onAddTodo: () => {},
  updateError: () => {},
  tempTodo: null,
  todosLoading: [],
  onCloseError: () => {},
  onDeleteTodo: () => {},
  toggleTodoStatus: () => {},
  toggleAllTodoStatus: () => {},
  clearAllActive: () => {},
  updateSortField: () => {},
  sortField: SORT.ALL,
  updateTodo: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosError, setTodosError] = useState<ERRORS>(ERRORS.NONE);
  const [todosLoading, setTodosLoading] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [sortField, setSortField] = useState<SORT>(SORT.ALL);

  useEffect(() => {
    getTodos(USER_ID)
      .then((serverTodos) => setTodos(serverTodos))
      .catch(() => setTodosError(ERRORS.FETCH));
  }, []);

  const updateSortField = (sort: SORT) => {
    setSortField(sort);
  };

  const updateError = (error: ERRORS) => {
    setTodosError(error);
  };

  const onCloseError = () => {
    setTodosError(ERRORS.NONE);
  };

  const onAddTodo = async (newTitle: string) => {
    setTodosLoading([0]);
    setTempTodo({ title: newTitle, id: 0, userId: USER_ID, completed: false });

    try {
      const responce = await postTodo(USER_ID, {
        title: newTitle,
        completed: false,
        userId: USER_ID,
      });

      setTodos((prev) => [...prev, responce]);
    } catch {
      setTodosError(ERRORS.ADD);
    } finally {
      setTodosLoading([]);
      setTempTodo(null);
    }
  };

  const onDeleteTodo = async (todoId: number) => {
    setTodosLoading((prev) => [...prev, todoId]);

    try {
      await deleteTodo(todoId);

      setTodos((prev) => prev.filter((todo) => todo.id !== todoId));
    } catch {
      setTodosError(ERRORS.DELETE);
    } finally {
      setTodosLoading((prev) => prev.filter((ids) => ids !== todoId));
    }
  };

  const toggleTodoStatus = async (todoId: number) => {
    setTodosLoading((prev) => [...prev, todoId]);

    try {
      const currentTodo = todos.find((todo) => todo.id === todoId) as Todo;
      const newStatus = !currentTodo.completed;

      await patchTodo(todoId, { completed: newStatus });

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === todoId ? { ...todo, completed: newStatus } : todo
        )
      );
    } catch {
      setTodosError(ERRORS.UPDATE);
    } finally {
      setTodosLoading((prev) => prev.filter((ids) => ids !== todoId));
    }
  };

  const toggleAllTodoStatus = async () => {
    const isEveryCompleted = todos.every((todo) => todo.completed);

    try {
      if (isEveryCompleted) {
        setTodosLoading(todos.map((todo) => todo.id));
        await Promise.all(
          todos.map((todo) => patchTodo(todo.id, { completed: false }))
        );

        setTodos(todos.map((todo) => ({ ...todo, completed: false })));
      } else {
        setTodosLoading(
          todos.filter((todo) => !todo.completed).map((todo) => todo.id)
        );

        await Promise.all(
          todos.map((todo) => patchTodo(todo.id, { completed: true }))
        );

        setTodos(todos.map((todo) => ({ ...todo, completed: true })));
      }
    } catch {
      setTodosError(ERRORS.UPDATE);
    } finally {
      setTodosLoading([]);
    }
  };

  const clearAllActive = async () => {
    const todosId = todos
      .filter((todo) => todo.completed)
      .map((todo) => todo.id);

    setTodosLoading((prev) => [...prev, ...todosId]);

    try {
      await Promise.all(todosId.map((todoId) => deleteTodo(todoId)));
      setTodos((prev) => prev.filter((todo) => !todo.completed));
    } catch {
      setTodosError(ERRORS.UPDATE);
    } finally {
      setTodosLoading([]);
    }
  };

  const updateTodo = async (newTitle: string, id: number) => {
    setTodosLoading((prev) => [...prev, id]);

    try {
      const todo = todos.find((todo) => todo.id === id);

      if (todo?.title !== newTitle) {
        await patchTodo(id, { title: newTitle });

        setTodos((prev) =>
          prev.map((todo) =>
            todo.id === id ? { ...todo, title: newTitle } : todo
          )
        );
      }
    } catch {
      setTodosError(ERRORS.UPDATE);
    } finally {
      setTodosLoading((prev) => prev.filter((ids) => ids !== id));
    }
  };

  const value = {
    todos,
    error: todosError,
    onAddTodo,
    updateError,
    tempTodo,
    todosLoading,
    onCloseError,
    toggleTodoStatus,
    onDeleteTodo,
    toggleAllTodoStatus,
    clearAllActive,
    sortField,
    updateSortField,
    updateTodo,
  };
  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};
