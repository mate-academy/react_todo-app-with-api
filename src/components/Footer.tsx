import { FC } from 'react';
import { FilterStates } from '../types/enums';
import { Todo } from '../types/Todo';

interface FooterProps {
  todos: Todo[];
  filter: FilterStates;
  setFilter: (filter: FilterStates) => void;
  onClearCompleted: () => void;
}

export const Footer: FC<FooterProps> = ({
  todos,
  filter,
  setFilter,
  onClearCompleted,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed).length;
  const filterValues = Object.values(FilterStates);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterValues.map(state => (
          <a
            key={state}
            href={`#/${state}`}
            className={`filter__link ${filter === state ? 'selected' : ''}`}
            data-cy={`FilterLink${state.charAt(0).toUpperCase() + state.slice(1)}`}
            onClick={() => setFilter(state)}
          >
            {state.charAt(0).toUpperCase() + state.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.every(todo => !todo.completed)}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
