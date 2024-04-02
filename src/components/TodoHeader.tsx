import classNames from 'classnames';

type Props = {
  tempAddTodo: (title: string) => void;
  areAllCompleted: boolean;
  disabled: boolean;
  title: string;
  setTitle: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  toggleAll: () => void;
  todoslength: number;
};

export const TodoHeader: React.FC<Props> = ({
  tempAddTodo,
  areAllCompleted,
  disabled,
  title,
  setTitle,
  inputRef,
  toggleAll,
  todoslength,
}) => {
  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    tempAddTodo(title);
  };

  return (
    <header className="todoapp__header">
      {!!todoslength && (
        <button
          aria-label="toggle"
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: areAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <form onSubmit={submitForm}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={disabled}
          ref={inputRef}
          value={title}
          onChange={event => {
            setTitle(event.target.value);
          }}
        />
      </form>
    </header>
  );
};
