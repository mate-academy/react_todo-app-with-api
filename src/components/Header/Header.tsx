import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';

type Props = {
  totalCount: number;
  activeCount: number;
  formField: React.RefObject<HTMLInputElement>;

  onSubmit: (newValue: string) => Promise<void>;
  toggleAll: (activeCount: number) => void;

  showError: (message: string) => void;
  setShowErrorMessage: (newValue: boolean) => void;
};

export const Header: React.FC<Props> = ({
  totalCount,
  activeCount,
  formField,

  onSubmit,
  toggleAll,

  showError,
  setShowErrorMessage,
}) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      formField.current?.focus();
    }
  }, [formField, isLoading]);

  const handleTitleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setShowErrorMessage(false);
      setTitle(event.target.value);
    },
    [setShowErrorMessage],
  );

  const trimmedTitle = title.trim();

  const addTodo = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      if (!trimmedTitle) {
        showError('Title should not be empty');

        return;
      }

      setIsLoading(true);

      onSubmit(trimmedTitle)
        .then(() => setTitle(''))
        .catch(() => {})
        .finally(() => setIsLoading(false));
    },
    [onSubmit, showError, trimmedTitle],
  );

  return (
    <header className="todoapp__header">
      {totalCount !== 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: !activeCount,
          })}
          data-cy="ToggleAllButton"
          onClick={() => toggleAll(activeCount)}
        />
      )}

      <form onSubmit={addTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={formField}
          value={title}
          onChange={handleTitleChange}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
