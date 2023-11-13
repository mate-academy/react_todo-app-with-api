import React from 'react';
import cn from 'classnames';
import { countActiveTodos, countCompletedTodos } from '../utils/helpers';
import { Todo } from '../types/Todo';
import { FilterBy } from '../types/FilterBy';

type Props = {
  todos: Todo[],
  filterBy: FilterBy,
  setFilterBy: React.Dispatch<React.SetStateAction<FilterBy>>,
  handleDeleteCompletedTodos: () => Promise<void>,
};

export const Footer: React.FC<Props> = ({
  todos,
  filterBy,
  setFilterBy,
  handleDeleteCompletedTodos,
}) => {
  const filters: FilterBy[] = ['All', 'Active', 'Completed'];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countActiveTodos(todos)} items left`}
      </span>
      <nav className="filter" data-cy="Filter">

        {filters.map(filter => (
          <a
            href={filter === 'All' ? '#/' : `#/${filter}`}
            className={cn('filter__link', {
              selected: filterBy === filter,
            })}
            data-cy={`FilterLink${filter}`}
            onClick={() => setFilterBy(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className={cn('todoapp__clear-completed', {
          'is-invisible': !countCompletedTodos(todos),
        })}
        data-cy="ClearCompletedButton"
        onClick={handleDeleteCompletedTodos}
        disabled={countCompletedTodos(todos) === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
