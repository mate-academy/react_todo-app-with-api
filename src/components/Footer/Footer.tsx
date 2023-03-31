import cn from 'classnames';
import { FC, memo } from 'react';
import { FilterType } from '../../types/FilterType';
import { Todo } from '../TodoItem/Todo';

interface Props {
  activeTodos: Todo[],
  completedTodos: Todo[],
  filterType: FilterType,
  onChangeFilterType: (filterType: FilterType) => void,
  onRemoveCompleted: () => void,
}

export const Footer: FC<Props> = memo((props) => {
  const {
    filterType,
    activeTodos,
    completedTodos,
    onChangeFilterType,
    onRemoveCompleted,
  } = props;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter">
        {Object.values(FilterType).map(value => (
          <a
            href={`#/${value}`}
            key={value}
            className={cn('filter__link', {
              selected: value === filterType,
            })}
            onClick={() => onChangeFilterType(value)}
          >
            {value}
          </a>
        ))}
      </nav>

      {completedTodos.length > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={onRemoveCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
});
