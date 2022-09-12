import classNames from 'classnames';
import { FC } from 'react';
import { FilterType, Todo } from '../types/Todo';

interface Props {
  todos: Todo[],
  setFilterType: (str: FilterType) => void,
  filterType: string,
  clearCompleted:() => void,
}

export const Footer: FC<Props> = (props) => {
  const {
    todos,
    setFilterType,
    filterType,
    clearCompleted,
  } = props;

  return (
    <>
      {todos.length !== 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="todosCounter">
            {`${todos.length} items left`}
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              data-cy="FilterLinkAll"
              href="#/"
              className={classNames(
                'filter__link', { selected: filterType === 'all' },
              )}
              onClick={() => setFilterType('all')}
            >
              All
            </a>

            <a
              data-cy="FilterLinkActive"
              href="#/active"
              className={classNames(
                'filter__link', { selected: filterType === 'active' },
              )}
              onClick={() => setFilterType('active')}
            >
              Active
            </a>
            <a
              data-cy="FilterLinkCompleted"
              href="#/completed"
              className={classNames(
                'filter__link', { selected: filterType === 'completed' },
              )}
              onClick={() => setFilterType('completed')}
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
      )}
    </>
  );
};
