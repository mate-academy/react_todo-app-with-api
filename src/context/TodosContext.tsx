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
  todoLoading: false,
  tempTodo: null,
  onAddNewTodo: () => {},
  onDeleteTodo: () => {},
  toggleStatus: async () => {},
  toggleAll: () => {},
  togglingLoading: false,
  onClearCompleted: () => {},
  loadedId: [],
  updateTodo: async () => {},
  areClearing: false,
  updateError: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoLoading, setTodoLoading] = useState(false);
  const [sortField, setSortField] = useState<SORT>(SORT.ALL);
  const [todosError, setTodosError] = useState("");
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [togglingLoading, setTogglingLoading] = useState(false);
  const [loadedId, setLoadedId] = useState<number[]>([]);
  const [areClearing, setAreClearing] = useState(false);

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
    setTodoLoading(true);
    const { userId, completed, title } = todo;

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
      setTodoLoading(false);
      setTempTodo(null);
    }
  };

  const onDeleteTodo = async (todoId: number) => {
    try {
      await deleteTodo(todoId);

      setTodos((currentTodos) =>
        currentTodos.filter((todo) => todo.id !== todoId)
      );
    } catch {
      setTodosError("Unable to delete a todo");
    }
  };

  const toggleStatus = async (todoId: number) => {
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
    }
  };

  const toggleAll = async () => {
    const isEveryCompleted = todos.every((todo) => todo.completed);

    setTogglingLoading(true);

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
      setTogglingLoading(false);
    }
  };

  const onClearCompleted = async () => {
    const completedId = todos
      .filter((todo) => todo.completed)
      .map((todo) => todo.id);

    setAreClearing(true);

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
      setAreClearing(false);
    }
  };

  const updateTodo = async (id: number, newTitle: string) => {
    const currentTodo = todos.find((todo) => todo.id === id) as Todo;

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
    todoLoading,
    onAddNewTodo,
    onDeleteTodo,
    toggleStatus,
    toggleAll,
    togglingLoading,
    onClearCompleted,
    loadedId,
    updateTodo,
    areClearing,
    updateError
  };

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};
