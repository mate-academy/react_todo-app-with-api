import classNames from 'classnames';
import { useEffect, useRef } from 'react';

type Props = {
  todoTitle: string,
  onTodoTitle: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  onToggleAll: () => void,
  isAllCompleted: boolean,
  isTitleDisabled: boolean,
};

export const Header: React.FC<Props> = ({
  todoTitle,
  onTodoTitle,
  onSubmit,
  isAllCompleted,
  onToggleAll,
  isTitleDisabled,
}) => {
  const focusedInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusedInputRef.current) {
      focusedInputRef.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: isAllCompleted,
        })}
        data-cy="ToggleAllButton"
        aria-label="ToggleAll"
        onClick={onToggleAll}
      />
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={onTodoTitle}
          ref={focusedInputRef}
          disabled={isTitleDisabled}
        />
      </form>
    </header>
  );
};
