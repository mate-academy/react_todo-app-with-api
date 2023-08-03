/*eslint-disable*/
import React, { createContext, useEffect, useState } from "react";
import { USER_ID } from "../App";
import { deleteTodo, getTodos, patchTodo, postTodo } from "../api/todos";
import { SORT } from "../types/SortEnum";
import { Todo } from "../types/Todo";
import { IContext } from "../types/TodosContext";

export const TodosContext = createContext<IContext>({
  todos: [],
  sortField: SORT.ALL,
  error: "",
  updateSortField: () => {},
  onCloseError: () => {},
  tempTodo: null,
  onAddNewTodo: () => {},
  onDeleteTodo: async () => {},
  toggleStatus: async () => {},
  toggleAll: () => {},
  onClearCompleted: () => {},
  loadedId: [],
  updateTodo: async () => {},
  updateError: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortField, setSortField] = useState<SORT>(SORT.ALL);
  const [todosError, setTodosError] = useState("");
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadedId, setLoadedId] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then((serverTodos) => setTodos(serverTodos))
      .catch(() => setTodosError("Unable to fetch a todo"));
  }, []);

  const updateSortField = (term: SORT) => {
    setSortField(term);
  };

  const onCloseError = () => {
    setTodosError("");
  };

  const onAddNewTodo = async (todo: Todo) => {
    onCloseError();
    const { userId, completed, title } = todo;

    setLoadedId((ids) => [...ids, todo.id]);

    setTempTodo({
      userId,
      completed,
      title,
      id: 0,
    });

    try {
      const responce = await postTodo(USER_ID, { userId, completed, title });

      setTodos((prev) => [...prev, responce]);
    } catch (error) {
      setTodosError("Unable to add a todo");

      return;
    } finally {
      setTempTodo(null);
      setLoadedId((ids) => ids.filter((id) => id !== todo.id));
    }
  };

  const onDeleteTodo = async (todoId: number) => {
    onCloseError();

    setLoadedId((ids) => [...ids, todoId]);
    try {
      const responce = (await deleteTodo(todoId)) as number;

      setTodos((currentTodos) =>
        currentTodos.filter((todo) => todo.id !== todoId)
      );

      return responce;
    } catch {
      setTodosError("Unable to delete a todo");

      throw Promise.reject();
    } finally {
      setLoadedId((ids) => ids.filter((id) => id !== todoId));
    }
  };

  const toggleStatus = async (todoId: number) => {
    onCloseError();

    setLoadedId((ids) => [...ids, todoId]);
    const currentTodo = todos.find((todo) => todo.id === todoId) as Todo;

    currentTodo.completed = !currentTodo.completed;

    try {
      const responce = (await patchTodo(todoId, currentTodo)) as Todo;

      setTodos((prev) => {
        return prev.map((todo) => ({
          ...todo,
          currentTodo,
        }));
      });

      return responce;
    } catch {
      setTodosError("Unable to update a todo");

      return;
    } finally {
      setLoadedId((ids) => ids.filter((id) => id !== todoId));
    }
  };

  const toggleAll = async () => {
    onCloseError();
    const isEveryCompleted = todos.every((todo) => todo.completed);

    if (isEveryCompleted) {
      const idsEvery = todos.map((todo) => todo.id);
      setLoadedId((ids) => [...ids, ...idsEvery]);
    } else {
      const idsSome = todos
        .filter((todo) => !todo.completed)
        .map((todo) => todo.id);
      setLoadedId((ids) => [...ids, ...idsSome]);
    }

    try {
      if (isEveryCompleted) {
        for (const todo of todos) {
          await patchTodo(todo.id, { ...todo, completed: false });
        }

        const allTodos = await getTodos(USER_ID);

        setTodos(() => allTodos);
      } else {
        for (const todo of todos) {
          await patchTodo(todo.id, { ...todo, completed: true });
        }

        const allTodos = await getTodos(USER_ID);

        setTodos(() => allTodos);
      }
    } catch {
      setTodosError("Unable to update a todo");
    } finally {
      setLoadedId([]);
    }
  };

  const onClearCompleted = async () => {
    onCloseError();
    const completedId = todos
      .filter((todo) => todo.completed)
      .map((todo) => todo.id);

    setLoadedId(completedId);

    try {
      for (const todoId of completedId) {
        setLoadedId((prev) => [...prev, todoId]);
        await deleteTodo(todoId);

        const allTodos = await getTodos(USER_ID);

        setTodos(() => allTodos);
      }
    } catch {
      setTodosError("Cannot clear completed todos");

      return;
    } finally {
      setLoadedId([]);
    }
  };

  const updateTodo = async (id: number, newTitle: string) => {
    onCloseError();
    const currentTodo = todos.find((todo) => todo.id === id) as Todo;

    setLoadedId((ids) => [...ids, id]);

    if (currentTodo.title !== newTitle) {
      currentTodo.title = newTitle;

      try {
        const responce = (await patchTodo(currentTodo.id, {
          ...currentTodo,
        })) as number;

        const allTodos = await getTodos(USER_ID);

        setTodos(() => allTodos);

        return responce;
      } catch {
        setTodosError("Unable to update a todo");

        return;
      } finally {
        setLoadedId((ids) => ids.filter((id) => id !== id));
      }
    } else {
      return;
    }
  };

  const updateError = (error: string) => {
    setTodosError(error);
  };

  const value = {
    todos,
    sortField,
    updateSortField,
    onCloseError,
    error: todosError,
    tempTodo,
    onAddNewTodo,
    onDeleteTodo,
    toggleStatus,
    toggleAll,
    onClearCompleted,
    loadedId,
    updateTodo,
    updateError,
  };

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};
