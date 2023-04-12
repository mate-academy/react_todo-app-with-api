import { FC, memo } from 'react';
import classNames from 'classnames';
import { FilterType } from '../../types/FilterType';
import { Todo } from '../../types/Todo';

type Props = {
  filterType: FilterType,
  onFilterChange: (filter: FilterType) => void,
  activeTodos: number,
  onDeleteCompleted: () => void,
  completedTodos: Todo[],
};

export const Footer: FC<Props> = memo((props) => {
  const {
    filterType,
    onFilterChange,
    activeTodos,
    onDeleteCompleted,
    completedTodos,
  } = props;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter">
        {Object.values(FilterType).map((filterName) => {
          const filterNameLowerCase = filterName.toLowerCase();
          const isCurFilterName = filterName === filterType;

          return (
            <a
              key={filterName}
              href={`#/${filterNameLowerCase}`}
              className={classNames(
                'filter__link',
                { selected: isCurFilterName },
              )}
              onClick={() => onFilterChange(filterName)}
            >
              {filterName}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          {
            'is-invisible': completedTodos.length === 0,
          },
        )}
        onClick={onDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
});
