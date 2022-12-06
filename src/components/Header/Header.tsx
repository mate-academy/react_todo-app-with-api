import { FormEventHandler, LegacyRef } from 'react';
import classNames from 'classnames';
import '../../styles/index.scss';
import { Todo } from '../../types/Todo';

type Props = {
  newTodoField: LegacyRef<HTMLInputElement>;
  todos: Todo[];
  query: string;
  handleTodoCreate: FormEventHandler<HTMLFormElement>;
  setQuery: (title: string) => void;
  isTodoOnLoad: boolean;
  allStatus: () => void;
};

export const Header: React.FC<Props> = ({
  newTodoField,
  todos,
  handleTodoCreate,
  query,
  setQuery,
  isTodoOnLoad,
  allStatus,
}) => {
  const uncompletedTodos = todos.filter((todo: Todo) => !todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: uncompletedTodos.length === 0 },
          )}
          aria-label="Toggle All"
          onClick={allStatus}
        />
      )}

      <form onSubmit={handleTodoCreate}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isTodoOnLoad}
        />
      </form>
    </header>
  );
};
