import classNames from 'classnames';
import React, { useMemo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoFilter } from '../../types/TodoFilter';

interface Props {
  todos: Todo[];
  filter: string;
  onFilter: (filter: TodoFilter) => void;
  onDelete: (arrayId: number[]) => Promise<void>;
}

export const TodoFooter: React.FC<Props> = ({
  todos,
  filter,
  onFilter,
  onDelete,
}) => {
  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const activeItems = useMemo(() => {
    return todos.length - completedTodos.length;
  }, [completedTodos, todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeItems} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(TodoFilter).map(filterOption => (
          <a
            key={filterOption}
            href="#/"
            className={classNames('filter__link', {
              selected: filterOption === filter,
            })}
            data-cy={`FilterLink${filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}`}
            onClick={() => onFilter(filterOption)}
          >
            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos.length === 0}
        onClick={() => onDelete(completedTodos.map(todo => todo.id))}
      >
        Clear completed
      </button>
    </footer>
  );
};
