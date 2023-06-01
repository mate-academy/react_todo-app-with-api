import { memo } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';

interface Props {
  onSelect: (filter: string) => void;
  onClear: () => void;
  selectedFilter: string;
  comletedTodos: Todo[];
  countUncompletedTodos: number;
}

export const Footer: React.FC<Props> = memo(({
  onSelect,
  onClear,
  selectedFilter,
  comletedTodos,
  countUncompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${countUncompletedTodos} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: selectedFilter === Filter.ALL,
          })}
          onClick={() => {
            onSelect(Filter.ALL);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: selectedFilter === Filter.ACTIVE,
          })}
          onClick={() => {
            onSelect(Filter.ACTIVE);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: selectedFilter === Filter.COMPLETED,
          })}
          onClick={() => {
            onSelect(Filter.COMPLETED);
          }}
        >
          Completed
        </a>
      </nav>

      {comletedTodos.length > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={onClear}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
});
