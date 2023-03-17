import classnames from 'classnames';
import { Todo } from './types/Todo';

type Props = {
  query: string,
  setQuery: (query: string) => void,
  todos: Todo[],
  onAdd: () => void,
  tempTodo:Todo | null,
  onALLStatusChange: (todo: Todo[]) => void,
  setLoaderForHeader: (a: boolean) => void
};

export const Header: React.FC<Props> = ({
  query,
  setQuery,
  todos,
  onAdd,
  tempTodo,
  onALLStatusChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setLoaderForHeader,
}) => {
  const enableToggleAllButton = () => {
    return todos.filter(todoToChange => todoToChange.completed).length;
  };

  const handleOnSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAdd();
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classnames(
          'todoapp__toggle-all',
          { active: enableToggleAllButton() === todos.length },
        )}
        aria-label="Add todo"
        onClick={() => {
          // setLoaderForHeader(true);
          onALLStatusChange(todos);
        }}
      />

      <form
        onSubmit={handleOnSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => setQuery(event.target.value)}
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
};
