import React from 'react';
import cn from 'classnames';
import { Filters, Todo } from '../../types';

interface Props {
  todos: Todo[];
  selectedFilter: Filters;
  onChangeFilter: (filter: Filters) => void;
  onDeleteCompleted: () => void;
}

export const TodoFooter: React.FC<Props> = ({
  todos,
  selectedFilter,
  onChangeFilter,
  onDeleteCompleted,
}) => {
  const filtersValue = Object.values(Filters);
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodo = todos.some(todo => todo.completed);
  let isDeletionCompleted = false;

  const handleDeleteCompleted = () => {
    isDeletionCompleted = true;
    onDeleteCompleted();
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filtersValue.map(filter => (
          <a
            key={filter}
            href={`#/${filter !== Filters.All ? filter.toLowerCase() : ''}`}
            className={cn('filter__link', {
              selected: filter === selectedFilter,
            })}
            data-cy={`FilterLink${filter}`}
            onClick={() => onChangeFilter(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={isDeletionCompleted || !hasCompletedTodo}
        style={{ visibility: !hasCompletedTodo ? 'hidden' : 'visible' }}
        onClick={handleDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
