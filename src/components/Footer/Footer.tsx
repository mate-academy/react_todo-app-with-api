import React from 'react';
import cn from 'classnames';

import { Select } from '../../types/Select';
import { Todo } from '../../types/Todo';

interface Props {
  onSelect: (value: Select) => void;
  activeTodos: Todo[];
  completedTodos: Todo[];
  select: Select;
  onRemove: (id: number) => void;
}

export const Footer: React.FC<Props> = ({
  onSelect,
  activeTodos,
  completedTodos,
  select,
  onRemove,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn(
            'filter__link',
            { selected: select === Select.All },
          )}
          onClick={() => onSelect(Select.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn(
            'filter__link',
            { selected: select === Select.Active },
          )}
          onClick={() => onSelect(Select.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn(
            'filter__link',
            { selected: select === Select.Completed },
          )}
          onClick={() => onSelect(Select.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={() => completedTodos.map(({ id }) => onRemove(id))}
        style={{ color: completedTodos.length ? 'inherit' : 'white' }}
      >
        Clear completed
      </button>
    </footer>
  );
};
