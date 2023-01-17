import classNames from 'classnames';
import React from 'react';

interface Props {
  newTodoField: React.RefObject<HTMLInputElement>
  todosLength: number,
  newTodoTitle: string,
  setNewTodoTitle: (value: string) => void,
  handlesSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  isAdding: boolean,
  activeToggleAll: boolean,
  handleToggleAll: () => void,
}

export const TodoAppHeader: React.FC<Props> = ({
  newTodoField,
  todosLength,
  newTodoTitle,
  setNewTodoTitle,
  handlesSubmit,
  isAdding,
  activeToggleAll,
  handleToggleAll,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setNewTodoTitle(value);
  };

  return (
    <header className="todoapp__header">
      {todosLength > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames(
            'todoapp__toggle-all', { active: activeToggleAll },
          )}
          aria-label="Mute volume"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handlesSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={handleChange}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
