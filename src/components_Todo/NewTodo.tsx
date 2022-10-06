import classNames from 'classnames';
import { FormEvent } from 'react';

/* eslint-disable jsx-a11y/control-has-associated-label */
interface Prors {
  newTodoField: React.RefObject<HTMLInputElement>;
  newTitleTodo: string;
  handleTitleTodo: (value: string) => void;
  handleAddTodo: (event: FormEvent) => void;
  isAdding: boolean;
  handleToggleAll: (value: boolean) => void;
  toggleAll: boolean;
}

export const NewTodo: React.FC<Prors> = ({
  newTodoField,
  newTitleTodo,
  handleTitleTodo,
  handleAddTodo,
  isAdding,
  handleToggleAll,
  toggleAll,
}) => {
  const handleNewTitle = (event: { target: { value: string; }; }) => {
    handleTitleTodo(event.target.value);
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={classNames('todoapp__toggle-all', { active: toggleAll })}
        onClick={() => handleToggleAll(toggleAll)}
      />

      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitleTodo}
          onChange={handleNewTitle}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
