/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, useEffect, useState } from 'react';
import cn from 'classnames';
import { Error } from './Error';
import { ErrorMessages } from '../types/ErrorMessages';

interface Props {
  onAdd: (title: string) => Promise<void>;
  onToggleAll: () => Promise<void>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  todosCount: { active: number; completed: number };
}

export const Header: FC<Props> = ({
  onAdd,
  onToggleAll,
  inputRef,
  todosCount,
}) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      await onAdd(title);
      setTitle('');
      setError(null);
    } catch {
      console.log(ErrorMessages.ENABLE_TO_ADD_TODO);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef, loading]);

  return (
    <header className="todoapp__header" data-cy="ErrorNotification">
      {(todosCount.active > 0 || todosCount.completed > 0) && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todosCount.active === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      {error && <Error errorMessage={error} onClose={() => setError(null)} />}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          value={title}
          disabled={loading}
          onChange={({ target }) => setTitle(target.value)}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
