import classnames from 'classnames';
import { useMemo } from 'react';
import { FilterType } from '../../types/FilterStatus';

import { Props } from './Footer.props';

export const Footer: React.FC<Props> = ({
  filterType,
  handleFilterType,
  todos,
  deleteCompleted,
}) => {
  const todosLeft = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);
  const todosCompleted = todos.length - todosLeft;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classnames(
            'filter__link',
            { selected: filterType === FilterType.All },
          )}
          onClick={() => handleFilterType(FilterType.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classnames(
            'filter__link',
            { selected: filterType === FilterType.Active },
          )}
          onClick={() => handleFilterType(FilterType.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classnames(
            'filter__link',
            { selected: filterType === FilterType.Completed },
          )}
          onClick={() => handleFilterType(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={deleteCompleted}
        disabled={!todosCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
