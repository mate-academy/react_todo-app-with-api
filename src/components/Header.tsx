/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { Error } from '../types/enumError';
import { addTodo, updateTodo, USER_ID } from '../api/todos';

type Props = {
  todos: Todo[];
  activeCount: number;
  inputRef: React.RefObject<HTMLInputElement>;
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  isInputDisabled: boolean;
  setErrorMessage: React.Dispatch<React.SetStateAction<Error>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const Header: React.FC<Props> = ({
  todos,
  activeCount,
  inputRef,
  newTodoTitle,
  setNewTodoTitle,
  isInputDisabled,
  setErrorMessage,
  setTempTodo,
  setIsInputDisabled,
  setTodos,
}) => {
  function addPost(loadingTodo: Todo) {
    setTempTodo(loadingTodo);
    setErrorMessage(Error.Default);
    setIsInputDisabled(true);

    addTodo({
      userId: loadingTodo.userId,
      title: loadingTodo.title,
      completed: loadingTodo.completed,
    })
      .then(createdTodo => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorMessage(Error.Add);
        setTimeout(() => setErrorMessage(Error.Default), 3000);
      })
      .finally(() => {
        setTempTodo(null);
        setIsInputDisabled(false);
        inputRef.current?.focus();
      });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    let timerId;

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage(Error.Empty);

      if (timerId) {
        clearTimeout(timerId);
      }

      timerId = setTimeout(() => {
        setErrorMessage(Error.Default);
        timerId = null;
      }, 3000);

      return;
    }

    const loadingTodo: Todo = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
      id: 0,
    };

    setTempTodo(loadingTodo);
    addPost(loadingTodo);
  }

  const handleCompleteAll = useCallback(async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const newCompletionState = !allCompleted;

    const todosToUpdate = todos.filter(
      todo => todo.completed !== newCompletionState,
    );

    const failedIds: number[] = [];

    for (const todo of todosToUpdate) {
      try {
        await updateTodo(todo.id, newCompletionState, todo.title);
      } catch {
        failedIds.push(todo.id);
      }
    }

    setTodos(currentTodos =>
      currentTodos.map(todo =>
        failedIds.includes(todo.id)
          ? todo
          : { ...todo, completed: newCompletionState },
      ),
    );

    if (failedIds.length > 0) {
      setErrorMessage(Error.Update);
    }
  }, [todos, setTodos, updateTodo, setErrorMessage]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          onClick={handleCompleteAll}
          type="button"
          className={cn('todoapp__toggle-all', activeCount === 0 && 'active')}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={event => setNewTodoTitle(event.target.value)}
          disabled={isInputDisabled}
          autoFocus
        />
      </form>
    </header>
  );
};
