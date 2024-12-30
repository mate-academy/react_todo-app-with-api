import React, { Dispatch, SetStateAction } from 'react';
import { Todo } from '../types/Todo';
import { Filters } from '../types/Filters';
import cn from 'classnames';

type Props = {
  currentFilter: Filters;
  setCurrentFilter: Dispatch<SetStateAction<Filters>>;
  todos: Todo[];
  handleClearCompleted: () => Promise<void>;
  activeTodos: number;
};

const filters = [
  { name: 'All', href: '#/', filter: Filters.All, dataCy: 'FilterLinkAll' },
  {
    name: 'Active',
    href: '#/active',
    filter: Filters.Active,
    dataCy: 'FilterLinkActive',
  },
  {
    name: 'Completed',
    href: '#/completed',
    filter: Filters.Completed,
    dataCy: 'FilterLinkCompleted',
  },
];

export const TodoFooter: React.FC<Props> = props => {
  const {
    todos,
    handleClearCompleted,
    currentFilter,
    setCurrentFilter,
    activeTodos,
  } = props;
  // const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(({ name, href, filter, dataCy }) => (
          <a
            key={filter}
            href={href}
            className={cn('filter__link', {
              selected: currentFilter === filter,
            })}
            data-cy={dataCy}
            onClick={() => setCurrentFilter(filter)}
          >
            {name}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.every(todo => !todo.completed)}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
