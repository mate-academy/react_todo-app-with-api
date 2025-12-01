import cn from 'classnames';

type Props = {
  title: string;
  setTitle: (v: string) => void;
  onAdd: (e: React.FormEvent) => void;
  onToggleAll: () => void;
  allCompleted: boolean;
  hasTodos: boolean;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoHeader: React.FC<Props> = ({
  title,
  setTitle,
  onAdd,
  onToggleAll,
  allCompleted,
  hasTodos,
  isLoading,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allCompleted })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onAdd}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isLoading}
          autoFocus
        />
      </form>
    </header>
  );
};
