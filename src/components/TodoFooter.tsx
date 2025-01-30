import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { filterOptions } from '../types/filterOptions';

interface TodoFooterProps {
  todos: Todo[];
  selectedFilter: string;
  setSelectedFilter: React.Dispatch<React.SetStateAction<string>>;
  clearCompletedTodos: () => void;
}

const TodoFooter: React.FC<TodoFooterProps> = ({
  todos,
  selectedFilter,
  setSelectedFilter,
  clearCompletedTodos,
}) => {
  const itemsLeft = todos.filter(todo => !todo.completed).length;

  const capitalize = (value: string): string => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(filterOptions).map(filter => (
          <a
            key={filter}
            className={classNames('filter__link', {
              selected: selectedFilter === filter,
            })}
            data-cy={`FilterLink${capitalize(filter)}`}
            onClick={() => setSelectedFilter(filter)}
          >
            {capitalize(filter)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompletedTodos}
        disabled={!todos.some(todo => todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default TodoFooter;
