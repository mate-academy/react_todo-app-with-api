import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

import { Todo } from '../types/Todo';
import { TodoError } from '../types/Error';

type Props = {
  todos: Todo[];
  inputRef: React.RefObject<HTMLInputElement>;
  onSubmit: (title: string) => Promise<boolean>;
  onError: (msg: TodoError) => void;
  onToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  todos,
  inputRef,
  onSubmit,
  onError,
  onToggleAll,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!isSubmitting) {
      inputRef.current?.focus();
    }
  }, [inputRef, isSubmitting]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      onError(TodoError.EMPTY_TITTLE);
      inputRef.current?.focus();

      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onSubmit(title);

      if (success) {
        setTitle('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          onChange={event => handleTitleChange(event)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
