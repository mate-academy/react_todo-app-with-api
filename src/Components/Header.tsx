import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

type Props = {
  onTodoAdd: (title: string) => Promise<void>;
  isAllCompleted: boolean;
  hasTodos: boolean,
  onTodoAddError: (error: string | null) => void;
  inputDisabled: boolean;
  onToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  onTodoAdd,
  isAllCompleted,
  hasTodos,
  onTodoAddError,
  inputDisabled,
  onToggleAll,
}) => {
  const [title, setTitle] = useState('');

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    onTodoAddError(null);
  };

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      onTodoAddError('Title should not be empty');

      return;
    }

    onTodoAdd(trimmedTitle)
      .then(() => {
        setTitle('');
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputDisabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputDisabled]);

  return (
    <header className="todoapp__header">
      {Boolean(hasTodos) && (
        <button
          type="button"
          aria-label="Toggle All"
          className={cn('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          ref={inputRef}
          disabled={inputDisabled}
        />
      </form>
    </header>
  );
};
