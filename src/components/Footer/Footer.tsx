import cn from 'classnames';
import { FilterTypes } from '../../types/FIlterTypes';
import { Todo } from '../../types/Todo';

type Props = {
  filterType: FilterTypes,
  handleFilterType: (filter: FilterTypes) => void,
  hasCompletedTodos: boolean,
  deleteAllCompleted: () => void,
  activeTodos: Todo[],
};

export const Footer: React.FC<Props> = ({
  filterType,
  handleFilterType, hasCompletedTodos, deleteAllCompleted, activeTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: FilterTypes.ALL === filterType,
          })}
          onClick={() => handleFilterType(FilterTypes.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: FilterTypes.ACTIVE === filterType,
          })}
          onClick={() => handleFilterType(FilterTypes.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: FilterTypes.COMPLETED === filterType,
          })}
          onClick={() => handleFilterType(FilterTypes.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={cn('todoapp__clear-completed', {
          'is-invisible': !hasCompletedTodos,
        })}
        onClick={() => deleteAllCompleted()}
      >
        Clear completed
      </button>
    </footer>
  );
};
