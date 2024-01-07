import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { ErrorInfo } from '../types/Error';

type Props = {
  onError: (error: ErrorInfo) => void,
  onTodoAdd: (todo: string) => Promise<void>,
  isActive: boolean,
  onToggleAll: () => void,
  showButton: boolean,
};

export const Header: React.FC<Props> = ({
  onError,
  onTodoAdd,
  isActive,
  onToggleAll,
  showButton,
}) => {
  const [title, setTitle] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSubmiting]);

  const handleSubmit = async (event: React.FormEvent) => {
    setIsSubmiting(true);

    event.preventDefault();
    const trimedTitle = title.trim();

    if (!trimedTitle) {
      onError(ErrorInfo.TITLE_NOT_EMPTY);
      setTitle('');
      setIsSubmiting(false);

      return;
    }

    try {
      await onTodoAdd(trimedTitle);
      setIsSubmiting(false);
      setTitle('');
    } catch {
      throw new Error();
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <header className="todoapp__header">
      {showButton && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isActive,
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
          onChange={(event) => setTitle(event.target.value)}
          disabled={isSubmiting}
        />
      </form>
    </header>
  );
};
