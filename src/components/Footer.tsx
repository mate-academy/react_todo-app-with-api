import classNames from 'classnames';
import { deleteTodo } from '../api/todos';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[],
  filter: Filter,
  handleFilter: (filter: Filter) => void,
  handleError: (error: string) => void,
  handleIsUpdating: (status: boolean) => void,
  handleUpdatingIds: (ids: number[]) => void,
}

export const Footer: React.FC<Props> = ({
  todos, filter, handleFilter, handleError, handleIsUpdating, handleUpdatingIds,
}) => {
  const hasCompleted = todos.some(todo => todo.completed);
  const todosLeft = todos.filter(todo => !todo.completed).length;

  const handleCleaner = () => {
    handleUpdatingIds([]);
    handleIsUpdating(false);
  };

  const handleDeleteCompleted = () => {
    handleIsUpdating(true);
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    handleUpdatingIds(completedIds);

    completedIds.map(id => deleteTodo(id)
      .catch(() => handleError('Unable to delete a todo'))
      .finally(() => {
        if (id === completedIds[completedIds.length - 1]) {
          handleCleaner();
        }
      }));
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todosLeft} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filter === Filter.All },
          )}
          onClick={() => handleFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filter === Filter.Active },
          )}
          onClick={() => handleFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filter === Filter.Completed },
          )}
          onClick={() => handleFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      {hasCompleted && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => handleDeleteCompleted()}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
