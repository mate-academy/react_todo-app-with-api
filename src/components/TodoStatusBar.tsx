import classNames from 'classnames';
import { FC, useMemo } from 'react';
import { FilterType, TodoOptimistic } from '../types/Todo';

interface Props {
  todos: TodoOptimistic[],
  changeFilter: (filterType: FilterType) => void,
  filterType: FilterType,
  clearCompleted: () => void;
}

export const TodoStatusBar: FC<Props> = (props) => {
  const {
    todos, changeFilter, filterType, clearCompleted,
  } = props;

  const itemsLeft = useMemo(() => {
    const todosLeft = [...todos];

    return todosLeft.filter(todo => todo.completed === false).length;
  }, [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.All },
          )}
          onClick={() => {
            changeFilter(FilterType.All);
          }}
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
          onClick={() => changeFilter(FilterType.Active)}
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
          onClick={() => changeFilter(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
