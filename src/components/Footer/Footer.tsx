import { FC, useEffect, useState } from "react";
import { useTodos } from "../../lib/TodosContext";
import { ErrorText } from "../../types/ErrorText";
import { Filters } from "../Filters/Filters";
import * as serviceTodos from "../../api/todos";

export const Footer: FC = () => {
  const {
    isFocused,
    setIsFocused,
    inputTitleRef,
    setProcessTodoIds,
    todos,
    setErrorMessage,
    setTodos,
    setIsLoading,
  } = useTodos();
  const [hasCompletedTodos, setHasCompletedTodos] = useState(false);
  const countActiveTodos = todos.filter((todo) => !todo.completed).length;

  useEffect(() => {
    setHasCompletedTodos(todos.some((todo) => todo.completed));
  }, [todos]);

  useEffect(() => {
    if (isFocused && inputTitleRef.current) {
      inputTitleRef.current.focus();
    }
  }, [inputTitleRef, isFocused]);

  const clearCompletedTodos = async () => {
    const completedTodos = todos.filter((todo) => todo.completed);

    try {
      setIsFocused(false);
      setIsLoading(true);
      await Promise.all(
        completedTodos.map(async (todo) => {
          setProcessTodoIds((prevState) => [...prevState, todo.id]);
          await serviceTodos.deleteTodo(todo.id);
          setTodos((prevTodos) =>
            prevTodos.filter((prevTodo) => prevTodo.id !== todo.id),
          );
          setProcessTodoIds((prev) => prev.filter((id) => id !== todo.id));
        }),
      );
    } catch (error) {
      setErrorMessage(ErrorText.DeleteErr);
      setTimeout(() => setErrorMessage(ErrorText.NoErr), 2000);
    } finally {
      setIsLoading(false);
      setIsFocused(true);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countActiveTodos} items left
      </span>

      <Filters />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompletedTodos}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
