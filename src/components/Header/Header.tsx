import cn from 'classnames';

type Props = {
  isAllTodosCompleted: boolean;
  todosLength: number;
  onToggleAll: () => void;
  onAddTodo: (e: React.FormEvent<HTMLFormElement>) => void;
  inputRef: React.RefObject<HTMLInputElement> | null;
  query: string;
  setQuery: (e: string) => void;
  isLoading: boolean;
};

export const Header: React.FC<Props> = ({
  isAllTodosCompleted,
  todosLength,
  onToggleAll,
  onAddTodo,
  inputRef,
  query,
  setQuery,
  isLoading,
}) => {
  return (
    <header className="todoapp__header">
      {todosLength !== 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={() => onToggleAll()}
        />
      )}
      <form onSubmit={onAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={inputRef}
          value={query}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={e => setQuery(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
