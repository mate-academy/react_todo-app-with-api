import { FC, useRef, useEffect } from 'react';
import cn from 'classnames';

type Props = {
  todosAmount: number;
  uncompletedTodosAmount: number;
  isLoading: boolean;
  title: string;
  onTitleChange: (title: string) => void;
  onSubmit: (title: string) => void;
  onToggleAll: () => void;
  focusHeader: boolean;
};

export const Header: FC<Props> = ({
  todosAmount,
  uncompletedTodosAmount,
  isLoading,
  title,
  onTitleChange,
  onSubmit,
  onToggleAll,
  focusHeader,
}) => {
  const createTodoInput = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit(title);
  };

  useEffect(() => {
    if (focusHeader) {
      createTodoInput.current?.focus();
    }
  }, [focusHeader]);

  return (
    <header className="todoapp__header">
      {!!todosAmount && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: !uncompletedTodosAmount,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={createTodoInput}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
          value={title}
          onChange={event => onTitleChange(event.target.value.trimStart())}
        />
      </form>
    </header>
  );
};
