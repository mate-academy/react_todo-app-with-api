import { FC, useEffect, useState } from 'react';
import cn from 'classnames';

interface Props {
  onAdd: (title: string) => Promise<void>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  onToggleAll: () => Promise<void>;
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      await onAdd(title);
      setTitle('');
    } catch {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef, loading]);

  const toggleAllButton = (todosCount.active > 0 || todosCount.completed > 0) && (
    <button
      type="button"
      className={cn('todoapp__toggle-all', {
        active: !todosCount.active,
      })}
      data-cy="ToggleAllButton"
      onClick={onToggleAll}
    />
  );

  return (
    <header className="todoapp__header">
     {toggleAllButton}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          value={title}
          disabled={loading}
          onChange={({ target }) => setTitle(target.value)}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
