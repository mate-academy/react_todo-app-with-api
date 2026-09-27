import cn from 'classnames';

type Props = {
  todosLength: number;
  completedTodosCount: number;
  title: string;
  onTitleChange: (title: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  editInput: React.Ref<HTMLInputElement>;
  isLoading: boolean;
  isAddingTodo: boolean;
  onToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  todosLength,
  completedTodosCount,
  title,
  onTitleChange,
  onSubmit,
  editInput,
  isLoading,
  isAddingTodo,
  onToggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {!isLoading && todosLength > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: completedTodosCount === todosLength,
          })}
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
          ref={editInput}
          value={title}
          onChange={event => onTitleChange(event.target.value)}
          disabled={isAddingTodo}
        />
      </form>
    </header>
  );
};
