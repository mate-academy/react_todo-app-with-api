/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  isDisabled: boolean;
  onAdd: (title: string) => Promise<boolean>;
  onToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  todos,
  isDisabled,
  onAdd,
  onToggleAll,
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isDisabled) {
      inputRef.current?.focus();
    }
  }, [isDisabled, todos.length]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const success = await onAdd(title);

    if (success) {
      setTitle('');
    }
  };

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={isDisabled}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
