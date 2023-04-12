import classNames from 'classnames';
import { FilterType } from '../../helpers/filterTodos';

interface Props {
  activeTodosCount: number;
  hasCompletedTodo: boolean;

  removeAllCompleted: () => void;
  filterType: FilterType;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
}

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  hasCompletedTodo,

  removeAllCompleted: deleteAllCompleted,
  filterType,
  setFilter,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter">
        {Object.values(FilterType).map(type => (
          <a
            key={type}
            href={`#/${type === FilterType.All ? '' : type}`}
            className={classNames(
              'filter__link',
              { selected: filterType === type },
            )}
            onClick={() => setFilter(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          'is-invisible': !hasCompletedTodo,
        })}
        onClick={deleteAllCompleted}
      >
        Clear completed
      </button>

    </footer>
  );
};
