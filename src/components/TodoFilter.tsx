import { useCallback, useMemo } from 'react';
import classNames from 'classnames';

import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

import { filters } from '../utils/filters';

type Props = {
  todos: Todo[],
  filter: FilterType,
  onFilterChange: (filter: FilterType) => void,
  onDelete: (todoId: number) => Promise<void>,
};

export const TodoFilter: React.FC<Props> = ({
  todos, filter, onFilterChange, onDelete,
}) => {
  const todosLeft = useMemo(() => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  const isSomeCompleted = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  const handleClearCompleted = useCallback(() => {
    const todosCompleted = todos.filter(todo => todo.completed);

    todosCompleted.forEach(todo => onDelete(todo.id));
  }, [todos]);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todosLeft.length} items left`}
      </span>

      <nav className="filter">
        {filters.map(({ href, status }) => (
          <a
            href={href}
            className={classNames('filter__link', {
              selected: status === filter,
            })}
            onClick={() => onFilterChange(status)}
            key={status}
          >
            {status}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={handleClearCompleted}
        disabled={!isSomeCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
