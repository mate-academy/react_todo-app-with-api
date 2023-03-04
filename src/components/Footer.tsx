import classNames from 'classnames';
import { Dispatch, SetStateAction } from 'react';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

type Props = {
  activeTodos: Todo[];
  completedTodos: Todo[];
  filter: Filter;
  setFilter: Dispatch<SetStateAction<Filter>>;
  deleteAllCompletedHandler: () => void;
};

export const Footer: React.FC<Props> = (props) => {
  const {
    activeTodos,
    completedTodos,
    filter,
    setFilter,
    deleteAllCompletedHandler,
  } = props;

  const FilterTypes = [Filter.All, Filter.Active, Filter.Completed];

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter">
        {FilterTypes.map(filterType => (
          <a
            key={filterType}
            href="#/"
            className={classNames(
              'filter__link', { selected: filter === filterType },
            )}
            onClick={() => setFilter(filterType)}
          >
            {filterType}
          </a>

        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        style={{ opacity: +Boolean(completedTodos.length) }}
        onClick={deleteAllCompletedHandler}
      >
        Clear completed
      </button>
    </footer>
  );
};
