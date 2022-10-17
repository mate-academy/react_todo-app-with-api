import classNames from 'classnames';
import {
  ChangeEvent, FormEvent, useEffect, useRef, memo,
} from 'react';

type Props = {
  isTodos: boolean;
  query: string;
  isAdding: boolean,
  hasActive: boolean,
  onAddNewTodo: () => void;
  onQueryChange: (value: string) => void;
  onUpdateStatusForAll: (hasActive: boolean) => void;
};

export const NewTodo: React.FC<Props> = memo(({
  isTodos,
  query,
  isAdding,
  hasActive,
  onAddNewTodo,
  onQueryChange,
  onUpdateStatusForAll,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onQueryChange(event.target.value);
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddNewTodo();
  };

  const handleToggleAllButton = () => onUpdateStatusForAll(hasActive);

  return (
    <header className="todoapp__header">
      {isTodos
      && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames('todoapp__toggle-all', { active: !hasActive })}
          aria-label="Toggle All"
          onClick={handleToggleAllButton}
        />
      )}

      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleInputChange}
          disabled={isAdding}
        />
      </form>
    </header>
  );
});
