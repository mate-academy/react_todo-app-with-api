import classNames from 'classnames';

type Props = {
  title: string;
  loading: boolean;
  todoActive: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onToggleAll: () => void;
  hasTodos: boolean;
};

export const Header: React.FC<Props> = ({
  title,
  onChange,
  onSubmit,
  onToggleAll,
  todoActive,
  loading,
  inputRef,
  hasTodos,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {hasTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', { active: todoActive })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          autoFocus
          ref={inputRef}
          value={title}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={loading}
          onChange={onChange}
        />
      </form>
    </header>
  );
};
