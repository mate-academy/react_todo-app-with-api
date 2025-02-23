import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  handleErrorMessage: (error: string) => void;
  onSubmit: (todo: Todo) => Promise<void>;
  onUpdate: (todo: Todo) => Promise<void>;
  userId: number;
};

export const Header: React.FC<Props> = ({
  todos,
  handleErrorMessage,
  onSubmit,
  onUpdate,
  userId,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const reset = () => {
    setTitle('');
    handleErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      handleErrorMessage('Title should not be empty');

      return;
    }

    setIsSubmitting(true);

    onSubmit({ id: 0, title: normalizedTitle, userId, completed: false })
      .then(reset)
      .finally(() => setIsSubmitting(false));
  };

  const changeStatus = (status: boolean) => {
    const changedTodos: Promise<void>[] = [];

    todos.forEach(todo => {
      if (todo.completed !== status) {
        changedTodos.push(onUpdate({ ...todo, completed: status }));
      }
    });

    Promise.allSettled(changedTodos);
  };

  const handleAllTodos = () => {
    if (todos.every(todo => todo.completed === true)) {
      return changeStatus(false);
    }

    if (todos.some(todo => todo.completed === false)) {
      return changeStatus(true);
    }
  };

  const completedTodos = todos.every(todo => todo.completed);
  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [isSubmitting, todos]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: completedTodos,
          })}
          data-cy="ToggleAllButton"
          onClick={handleAllTodos}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          ref={inputField}
          onChange={handleTitle}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
