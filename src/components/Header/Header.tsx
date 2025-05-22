import classNames from 'classnames';
import { FormEvent, useEffect, useRef } from 'react';

type Props = {
  todosCompleted: number;
  todosActive: number;
  titleValue: string;
  handleTitleValueChange: (titleValue: string) => void;
  handleAddTodo: (event: FormEvent) => void;
  isAddingTodo: boolean;
  isDeletingTodo: boolean;
  handleToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  todosCompleted,
  todosActive,
  titleValue,
  handleTitleValueChange,
  handleAddTodo,
  isAddingTodo,
  isDeletingTodo,
  handleToggleAll,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isAddingTodo && !isDeletingTodo) {
      inputRef.current?.focus();
    }
  }, [isDeletingTodo, isAddingTodo]);

  return (
    <header className="todoapp__header">
      {(!!todosCompleted || !!todosActive) && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: !todosActive && todosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleAddTodo}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={titleValue}
          onChange={event => handleTitleValueChange(event.target.value)}
          disabled={isAddingTodo}
        />
      </form>
    </header>
  );
};