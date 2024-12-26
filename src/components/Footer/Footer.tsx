import classNames from 'classnames';

import { Dispatch, SetStateAction } from 'react';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';

type Props = {
  todos: Todo[];
  activeTodo: number;
  filteredField: FilterType;
  setFilteredField: Dispatch<SetStateAction<FilterType>>;
  onClearCompleted: () => Promise<void>;
};

export const Footer: React.FC<Props> = ({
  todos,
  activeTodo,
  filteredField,
  setFilteredField,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodo} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map(filter => (
          <a
            key={filter}
            href={`#/${filter !== FilterType.All && filter.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: filteredField === filter,
            })}
            data-cy={`FilterLink${filter}`}
            onClick={() => setFilteredField(filter)}
          >
            {filter}
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
