import React from 'react';
import cn from 'classnames';
import './Footer.scss';
import { Todo } from '../../types/Todo';
import { TodoFilter } from '../../types/TodoFilter';

type Props = {
  todos: Todo[];
  selectedFilter: TodoFilter;
  setSelectedFilter: (f: TodoFilter) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  selectedFilter,
  setSelectedFilter,
  onClearCompleted,
}) => {
  const uncompletedTodosCount = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {uncompletedTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(TodoFilter).map(filter => (
          <a
            key={filter}
            href={`#/${filter.toLowerCase}`}
            className={cn('filter__link', {
              selected: selectedFilter === filter,
            })}
            data-cy={`FilterLink${filter}`}
            onClick={() => setSelectedFilter(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="footer__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.every(todo => !todo.completed)}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
