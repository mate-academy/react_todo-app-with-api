import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { TodoFilter } from '../types/FilterEnum';

interface InterfaceFooter {
  todoItem: Todo[];
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<TodoFilter>>;
  forClearCompleted: () => void;
  activeCount: Todo[];
}

export const Footer: React.FC<InterfaceFooter> = ({
  todoItem,
  filter,
  setFilter,
  forClearCompleted,
  activeCount,
}) => {
  return (
    <footer
      style={{ display: todoItem.length ? '' : 'none' }}
      className="todoapp__footer"
      data-cy="Footer"
    >
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeCount.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(TodoFilter).map(value => (
          <a
            key={value}
            href={`#/${value}`}
            className={classNames('filter__link', {
              selected: filter === value,
            })}
            data-cy={`FilterLink${value}`}
            onClick={() => setFilter(value)}
          >
            {value}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={forClearCompleted}
        disabled={todoItem.every(todo => !todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
