import classNames from 'classnames';
import {
  ChangeEvent, FormEvent, useEffect, useRef,
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

/* eslint-disable jsx-a11y/control-has-associated-label */
export const Header: React.FC<Props> = ({
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
    // focus the element with `ref={newTodoField}`
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
};
