import classNames from 'classnames';
import { FormEvent } from 'react';

interface Prors {
  newTodoField: React.RefObject<HTMLInputElement>;
  newTitleTodo: string;
  handleTitleTodo: (value: string) => void;
  handleAddTodo: (event: FormEvent) => void;
  handleToggleAll: (value: boolean) => void;
  toggleAll: boolean;
}

export const NewTodo: React.FC<Prors> = ({
  newTodoField,
  newTitleTodo,
  handleTitleTodo,
  handleAddTodo,
  handleToggleAll,
  toggleAll,
}) => {
  const handleNewTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleTitleTodo(event.target.value);
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        aria-label="ToggleAllButton"
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
        />
      </form>
    </header>
  );
};
