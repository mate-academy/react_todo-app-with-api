import React, { useContext } from 'react';
import cn from 'classnames';
import { Filter } from '../../types/Filter';
import { pluralize } from '../../utils/pluralize';
import { TodosContext } from '../../TodosContext';

interface Props {
  filter: Filter;
  setFilter: (q: Filter) => void;
  deleteCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  deleteCompleted, filter, setFilter,
}) => {
  const { todos } = useContext(TodosContext);

  const completedTodo = todos.some(todo => todo.completed);
  const todosLeft = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${pluralize(todosLeft, 'item')} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn(
            'filter__link',
            { selected: filter === Filter.All },
          )}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={
            cn(
              'filter__link',
              { selected: filter === Filter.Active },
            )
          }
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            cn(
              'filter__link',
              { selected: filter === Filter.Completed },
            )
          }
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={deleteCompleted}
        disabled={!completedTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};
