import { useCallback, useEffect, useRef, useState } from 'react';
import '../../styles/todoapp.scss';
import classNames from 'classnames';

interface Props {
  onAdd: (title: string) => Promise<void>;
  toggleAllTodos: () => void;
  completedCount: number;
  total: number;
}

export const Header: React.FC<Props> = ({
  onAdd,
  completedCount,
  total,
  toggleAllTodos,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  const submitHandler = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const trimmed = title.trim();

      setIsLoading(true);

      try {
        await onAdd(trimmed);
        setTitle('');
      } catch (error) {
        setTitle(trimmed);
      } finally {
        setIsLoading(false);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    },
    [title, onAdd],
  );

  const handleTitleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    },
    [],
  );

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}

      {total > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: completedCount === total,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllTodos}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={submitHandler}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          value={title}
          ref={inputRef}
          placeholder="What needs to be done?"
          onChange={handleTitleInput}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
