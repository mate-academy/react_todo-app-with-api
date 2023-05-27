import classNames from 'classnames';
import { useContext } from 'react';
import { FilterType } from '../../types/FilterType';
import { TodoListContext } from '../../context/TodoListContext';

type Props = {
  filterType: FilterType;
  activeTodosCount: number;
  areCompletedTodos: boolean;
  onDeleteCompleted: () => void;
};

export const TodoAppFooter: React.FC<Props> = ({
  filterType,
  activeTodosCount,
  areCompletedTodos,
  onDeleteCompleted,
}) => {
  const { setFilterType } = useContext(TodoListContext);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount} item${activeTodosCount === 1 ? '' : 's'} left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterType === FilterType.ALL,
          })}
          onClick={() => setFilterType(FilterType.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterType === FilterType.ACTIVE,
          })}
          onClick={() => setFilterType(FilterType.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterType === FilterType.COMPLETED,
          })}
          onClick={() => setFilterType(FilterType.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {areCompletedTodos && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => onDeleteCompleted()}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
