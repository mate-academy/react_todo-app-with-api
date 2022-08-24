import { FC, memo, useMemo } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { removeTodoByTodoId } from '../../api/todos';
import { FilterType } from '../../types/FilterType';

type Props = {
  todos: Todo[],
  handleError: (errorMsg: string) => void,
  handleUpdate: (bool: boolean) => void,
  filterType: FilterType
  handleFilterTypeChange: (filterType: FilterType) => void,
  handleUpdateStatuses: (statuses: boolean[]) => void,
};

export const TodoFooter: FC<Props> = memo(({
  todos,
  handleError,
  handleUpdate,
  filterType,
  handleFilterTypeChange,
  handleUpdateStatuses,
}) => {
  const statuses = todos.map(todo => todo.completed);
  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed)
  ), [todos]);

  const handleRemoveCompletedTodos = () => {
    const requests = Promise.all(
      completedTodos.map(todo => removeTodoByTodoId(todo.id)),
    );

    handleUpdateStatuses(statuses);

    requests
      .then(() => handleUpdate(true))
      .catch(() => handleError('Unable to delete completed todos'));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todos.length - completedTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.All },
          )}
          onClick={() => handleFilterTypeChange(FilterType.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.Active },
          )}
          onClick={() => handleFilterTypeChange(FilterType.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.Completed },
          )}
          onClick={() => handleFilterTypeChange(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={handleRemoveCompletedTodos}
        disabled={completedTodos.length === 0}
      >
        Clear completed
      </button>

    </footer>
  );
});
