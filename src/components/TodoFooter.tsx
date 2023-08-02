import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { FilteredBy } from '../types/FilteredBy';
import { todosForDelete } from '../utils/todosForDelete';

type Props = {
  todos: Todo[];
  filterBy: string;
  onFiltered: React.Dispatch<React.SetStateAction<FilteredBy>>;
  deleteCompletedTodos: () => void,
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  filterBy,
  onFiltered,
  deleteCompletedTodos,
}) => {
  const completedTodos = todosForDelete(todos);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todos.filter(todo => !todo.completed).length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterBy === FilteredBy.ALL,
          })}
          onClick={() => onFiltered(FilteredBy.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterBy === FilteredBy.ACTIVE,
          })}
          onClick={() => onFiltered(FilteredBy.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterBy === FilteredBy.COMPLETED,
          })}
          onClick={() => onFiltered(FilteredBy.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {completedTodos.length !== 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => deleteCompletedTodos()}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
