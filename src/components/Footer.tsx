import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface FooterProps {
  todos: Todo[];
  filterType: string;
  onFilterChange: (type: string) => void;
  onClearCompleted: () => void;
}

const filterTodos = (todos: Todo[], filterType: string) => {
  switch (filterType) {
    case 'active':
      return todos.filter((todo) => !todo.completed);
    case 'completed':
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
};

const Footer: React.FC<FooterProps> = ({
  todos,
  filterType,
  onFilterChange,
  onClearCompleted,
}) => {
  const filteredTodos = useMemo(() => filterTodos(todos, filterType), [
    todos,
    filterType,
  ]);

  const hasCompletedTodos = todos.some((todo) => todo.completed);

  const handleClearCompleted = () => {
    onClearCompleted();
  };

  return (
    <>
      {filteredTodos.length > 0 && (
        <footer className="todoapp__footer">
          <span className="todo-count">
            {filteredTodos.length}
            {filteredTodos.length === 1 ? ' item ' : ' items '}
            left
          </span>

          <nav className="filter">
            <a
              href="#/"
              className={classNames('filter__link', {
                selected: filterType === 'all',
              })}
              onClick={() => onFilterChange('all')}
            >
              All
            </a>

            <a
              href="#/active"
              className={classNames('filter__link', {
                selected: filterType === 'active',
              })}
              onClick={() => onFilterChange('active')}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={classNames('filter__link', {
                selected: filterType === 'completed',
              })}
              onClick={() => onFilterChange('completed')}
            >
              Completed
            </a>
          </nav>

          {hasCompletedTodos && (
            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          )}
        </footer>
      )}
    </>
  );
};

export default Footer;
