import cn from 'classnames';
import { FC, memo } from 'react';
import { FilterType } from '../../typedefs';
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

      <button
        type="button"
        className={cn('todoapp__clear-completed', {
          'is-invisible': completedTodos.length === 0,
        })}
        onClick={onRemoveCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
});
