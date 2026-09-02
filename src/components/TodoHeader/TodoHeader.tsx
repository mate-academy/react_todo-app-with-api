import { useEffect, useState } from 'react';
import { Errors } from '../../types/ErrorType';
import classNames from 'classnames';

interface Props {
  newTitle: string;
  setNewTitle: React.Dispatch<React.SetStateAction<string>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<Errors>>;
  onAddTodo: (title: string) => Promise<void>;
  field: React.RefObject<HTMLInputElement>;
  handleToggleAllTodos: () => Promise<void>;
  allTodosCompleted: boolean;
  showActiveButton: boolean;
}

export const TodoHeader: React.FC<Props> = ({
  newTitle,
  setNewTitle,
  setErrorMessage,
  onAddTodo,
  field,
  handleToggleAllTodos,
  allTodosCompleted,
  showActiveButton,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newTitle.trim() === '') {
      setErrorMessage(Errors.EmptyTitle);

      setTimeout(() => setErrorMessage(Errors.Default), 3000);

      return;
    }

    try {
      setIsLoading(true);
      await onAddTodo(newTitle.trim());
    } catch (error) {
    } finally {
      setIsLoading(false);
      field.current?.focus();
    }
  };

  useEffect(() => {
    field.current?.focus();
  }, [isLoading, newTitle, field]);

  return (
    <header className="todoapp__header">
      {!showActiveButton ? null : (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAllTodos}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={field}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={event => setNewTitle(event.target.value.trimStart())}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
