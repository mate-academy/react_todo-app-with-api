import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';

interface Props {
  onSumbit: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
  isTitleClear: boolean;
  onSetIsTitleClear: (needClear: boolean) => void;
  onToggleAllTodos: () => void;
  activeTodosCount: number;
  completedTodosCount: number;
}

export const Header: React.FC<Props> = ({
  onSumbit,
  isSubmitting,
  isTitleClear,
  onSetIsTitleClear,
  onToggleAllTodos,
  activeTodosCount,
  completedTodosCount,
}) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  useEffect(() => {
    if (isTitleClear) {
      setValue('');
      onSetIsTitleClear(false);
    }
  }, [isTitleClear, onSetIsTitleClear]);

  const handleInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {(activeTodosCount > 0 || completedTodosCount > 0) && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: activeTodosCount === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAllTodos}
        />
      )}

      <form>
        <input
          onKeyDown={onSumbit}
          onChange={handleInputOnChange}
          disabled={isSubmitting}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
