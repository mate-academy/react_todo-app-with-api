import cn from "classnames";
import React, { FC, useEffect, useState } from "react";
import * as serviceTodos from "../../api/todos";
import { USER_ID } from "../../api/todos";
import { useTodos } from "../../lib/TodosContext";
import { ErrorText } from "../../types/ErrorText";

export const Header: FC = () => {
  const {
    setIsFocused,
    isFocused,
    inputTitleRef,
    setProcessTodoIds,
    todos,
    setErrorMessage,
    setTodos,
    setTempTodo,
    setIsLoading,
    isLoading,
  } = useTodos();
  const [title, setTitle] = useState("");
  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  useEffect(() => {
    if (isFocused && inputTitleRef.current) {
      inputTitleRef.current.focus();
    }
  }, [inputTitleRef, isFocused]);

  const addTodo = async () => {
    const titleTrimmed = title.trim();

    if (!titleTrimmed) {
      setErrorMessage(ErrorText.EmptyErr);

      setTimeout(() => {
        setErrorMessage(ErrorText.NoErr);
      }, 2000);

      return;
    }

    const newTodo = {
      id: 0,
      title: titleTrimmed,
      completed: false,
      userId: USER_ID,
    };

    setErrorMessage(ErrorText.NoErr);
    setProcessTodoIds((prevState) => [...prevState, newTodo.id]);
    setTempTodo(newTodo);

    try {
      setIsFocused(false);
      setIsLoading(true);
      const data = await serviceTodos.createTodo(newTodo);

      setTodos((prevTodos) => [...prevTodos, data]);
      setTitle("");
    } catch (error) {
      setErrorMessage(ErrorText.AddErr);
      setTimeout(() => {
        setErrorMessage(ErrorText.NoErr);
        setTitle(title);
      }, 2000);
    } finally {
      setProcessTodoIds((prev) => prev.filter((id) => id !== newTodo.id));
      setTempTodo(null);
      setIsLoading(false);
      setIsFocused(true);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    addTodo();
  };

  const handleToggleAll = async () => {
    const allCompleted = activeTodos.length === 0;
    const todosToToggle = allCompleted ? completedTodos : activeTodos;

    try {
      setIsLoading(true);

      const updatedTodos = await Promise.all(
        todosToToggle.map(async (todo) => {
          setProcessTodoIds((prevState) => [...prevState, todo.id]);

          const updatedTodo = await serviceTodos.updateTodo({
            ...todo,
            completed: !todo.completed,
          });

          setProcessTodoIds((prev) => prev.filter((id) => id !== todo.id));

          return updatedTodo;
        }),
      );

      setTodos((prevTodos) => {
        const newTodos = [...prevTodos];

        updatedTodos.forEach((updatedTodo) => {
          const index = newTodos.findIndex(
            (todoItem) => todoItem.id === updatedTodo.id,
          );

          newTodos.splice(index, 1, updatedTodo);
        });

        return newTodos;
      });
    } catch (error) {
      setErrorMessage(ErrorText.UpdateErr);
      setTimeout(() => setErrorMessage(ErrorText.NoErr), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn("todoapp__toggle-all", {
            active: todos.every((el) => el.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputTitleRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
