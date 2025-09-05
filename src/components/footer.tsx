import React from 'react';
import { Todo } from '../types/Todo';
import { Sort } from '../types/Sort';
import cn from 'classnames';

type Props = {
  sort: (value: Sort) => void;
  userTodo: Todo[];
  visible: boolean;
  clearDelete: (value: Todo[]) => void;
};

export const Footer: React.FC<Props> = ({
  sort,
  userTodo,
  visible,
  clearDelete,
}) => {
  const [currentFilter, setCurrentFilter] = React.useState<Sort>('all');

  const itemsLeft = userTodo.filter(todo => !todo.completed).length;

  const handleFilterChange = (value: Sort) => {
    sort(value);
    setCurrentFilter(value);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: currentFilter === 'all' })}
          data-cy="FilterLinkAll"
          onClick={() => handleFilterChange('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: currentFilter === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => handleFilterChange('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: currentFilter === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleFilterChange('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={visible}
        onClick={() => clearDelete(userTodo)}
      >
        Clear completed
      </button>
    </footer>
  );
};
