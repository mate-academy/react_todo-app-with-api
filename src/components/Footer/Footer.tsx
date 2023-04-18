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
        {Object.entries(FilterType).map(([key, value]) => {
          const isCurrentFilterName = value === filterType;

          return (
            <a
              key={value}
              href={`#/${value}`}
              className={classNames(
                'filter__link',
                { selected: isCurrentFilterName },
              )}
              onClick={() => onFilterChange(value)}
            >
              {key}
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
