import { useCallback, useContext } from 'react';
import { TodoContext } from '../contexts/TodoContext';
import classNames from 'classnames';
import { FilterType } from '../App';
import { DeletingContext } from '../contexts/DeletingContext';

export interface FooterType {
  filter: FilterType;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  deleteAll: () => void;
}

export const Footer: React.FC<FooterType> = ({
  filter,
  setFilter,
  deleteAll,
}) => {
  const { todos } = useContext(TodoContext);
  const { setIsDeleteActive } = useContext(DeletingContext);

  const establishFilter = useCallback(
    (
      filterName: FilterType,
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    ) => {
      e.preventDefault();
      e.stopPropagation();

      setFilter(filterName);
    },
    [setFilter],
  );

  const todosLength = todos.filter(
    todo => !todo.completed && todo.id !== 0,
  ).length;
  const hasCompleted = !todos.some(todo => todo.completed);
  const isPlural = todosLength === 1 ? 'item' : 'items';

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLength} {isPlural} left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map(value => (
          <a
            key={value}
            href="#/"
            className={classNames('filter__link', {
              selected: filter === value,
            })}
            data-cy={'FilterLink' + value}
            onClick={e => establishFilter(value, e)}
          >
            {value}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => {
          setIsDeleteActive(true);

          deleteAll();
        }}
        disabled={hasCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
