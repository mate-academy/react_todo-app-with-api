import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { NewTodo, Todo } from '../types/Todo';
import { Errors } from '../types/Errors';

interface Props {
  todos: Todo[],
  title: string,
  userId: number,
  isDisabledInput: boolean,
  setTodos: (todos: Todo[]) => void,
  setTitle: (str: string) => void,
  handleUpdateTodo: (todo: Todo) => void,
  handleAddTodo: (newTodo: NewTodo, userId: number) => Promise<void>
  setErrorMessage: (message: Errors | '') => void
  setSubmittedTitle: (title: string) => void,
  submittedTitle: string,
}

export const TodoHeader: React.FC<Props> = ({
  todos,
  title,
  userId,
  isDisabledInput,
  setTitle,
  setTodos,
  handleAddTodo,
  setErrorMessage,
  handleUpdateTodo,
  setSubmittedTitle,
  submittedTitle,
}) => {
  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current?.focus();
    }
  }, [isDisabledInput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (trimmedTitle) {
      const newTodo: NewTodo = {
        title: trimmedTitle,
        userId,
        completed: false,
      };

      handleAddTodo(newTodo, userId);
      setSubmittedTitle(trimmedTitle);
    } else {
      setErrorMessage(Errors.EmptyTitle);
    }

    setTitle('');
  };

  const handleCheckedAllButton = async () => {
    const areAllCompleted = todos.every((todo) => todo.completed);

    if (areAllCompleted) {
      await Promise.all(
        todos.map((todo) => (
          handleUpdateTodo({
            ...todo,
            completed: false,
          }))),
      );
    } else {
      await Promise.all(
        todos.map((todo) => (
          handleUpdateTodo({
            ...todo,
            completed: true,
          }))),
      );
    }

    const updatedTodos = todos.map((todo) => ({
      ...todo,
      completed: !areAllCompleted,
    }));

    setTodos(updatedTodos);
  };

  const handleInputFocus = () => {
    setSubmittedTitle('');
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          aria-label="Toggle All Button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every((todo) => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleCheckedAllButton}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputField}
          value={title || submittedTitle}
          disabled={isDisabledInput}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={handleInputFocus}
        />
      </form>
    </header>
  );
};
