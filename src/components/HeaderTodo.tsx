import cn from 'classnames';

type Props = {
  allCompleted: boolean;
  hasTodos: boolean;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  title: string;
  isAdding: boolean;
  onSubmit: (event: React.FormEvent) => void;
  onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleAll: () => void;
};

export const HeaderTodo: React.FC<Props> = ({
  allCompleted,
  hasTodos,
  inputRef,
  title,
  isAdding,
  onSubmit: handleSubmit,
  onTitleChange: handleTitleChange,
  onToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          name="NewTodoField"
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          disabled={isAdding}
          autoFocus
        />
      </form>
    </header>
  );
};
