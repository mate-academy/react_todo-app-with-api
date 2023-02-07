import { memo } from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>,
  todoTitle: string,
  setTodoTitle: (title: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onToggleAll: () => void
  toggledAlltodos:boolean;

};

export const Header: React.FC<Props> = memo(({
  newTodoField,
  todoTitle,
  setTodoTitle,
  onSubmit,
  onToggleAll,
  toggledAlltodos,
}) => {
  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={toggledAlltodos
          ? ('todoapp__toggle-all active')
          : ('todoapp__toggle-all')}
        onClick={onToggleAll}
      />

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
});
