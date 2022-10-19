import classNames from 'classnames';
import React from 'react';
import { FilterTypes } from '../../types/FilterTypes';

interface Props {
  filterType: FilterTypes;
  changeFilterType: (value: FilterTypes) => void;
  deleteAllCompletedTodos: () => void;
  activeTodosCount: number;
  completedTodosCount: number;
}

const TodoFooter: React.FC<Props> = ({
  filterType,
  changeFilterType: change,
  deleteAllCompletedTodos,
  activeTodosCount: countActiveTodos,
  completedTodosCount: countCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${countActiveTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link', { selected: filterType === FilterTypes.All },
          )}
          onClick={() => change(FilterTypes.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link', { selected: filterType === FilterTypes.Active },
          )}
          onClick={() => change(FilterTypes.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link', { selected: filterType === FilterTypes.Completed },
          )}
          onClick={() => change(FilterTypes.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        style={{ visibility: countCompletedTodos ? 'visible' : 'hidden' }}
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={deleteAllCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default TodoFooter;
