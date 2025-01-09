import classNames from 'classnames';

type HeaderProps = {
  query: string;
  onInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmiting: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onUpdateAllTodos: () => void;
  itemsLeft: number;
  todosLength: number;
};

export function Header({
  query,
  onInput,
  onSubmit,
  isSubmiting,
  inputRef,
  onUpdateAllTodos,
  itemsLeft,
  todosLength,
}: HeaderProps) {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todosLength > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: itemsLeft === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={onUpdateAllTodos}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          value={query}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={onInput}
          disabled={isSubmiting}
          ref={inputRef}
        />
      </form>
    </header>
  );
}
