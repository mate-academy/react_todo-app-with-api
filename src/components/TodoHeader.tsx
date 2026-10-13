/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
type TodoHeaderProps = {
  hasTodos: boolean;
  hasAllTodosCompleted: boolean;
  onToggleAll: () => void;
  value: string;
  onValueChange: (value: string) => void;
  isAdding: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export const TodoHeader: React.FC<TodoHeaderProps> = ({
  hasTodos,
  hasAllTodosCompleted,
  onToggleAll,
  value,
  onValueChange,
  isAdding,
  inputRef,
  onSubmit,
}) => {
  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={`todoapp__toggle-all ${hasAllTodosCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={value}
          onChange={event => onValueChange(event.target.value)}
          disabled={isAdding}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
