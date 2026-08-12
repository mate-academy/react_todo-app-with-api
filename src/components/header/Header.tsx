import classNames from 'classnames';

type Props = {
  todosLength: number;
  allCompleted: boolean;
  toggleAll: () => void;
  handleSubmit: (event: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  title: string;
  setTitle: (value: string) => void;
  isDisabled: boolean;
};

export const Header: React.FC<Props> = ({
  todosLength,
  allCompleted,
  toggleAll,
  handleSubmit,
  inputRef,
  title,
  setTitle,
  isDisabled,
}) => {
  return (
    <header className="todoapp__header">
      {todosLength > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
