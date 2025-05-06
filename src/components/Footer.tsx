import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Selected } from '../types/Selected';
import { ItemsLeft } from './ItemsLeft';

interface Props {
  allTodos: Todo[];
  selected: Selected;
  setSelected: (selected: Selected) => void;
  clearAll: () => void;
  completedTodos: number;
}

const filters = Object.values(Selected).map(value => ({
  title: value,
  type: value,
  href: value === Selected.All ? '#/' : `#/${value.toLowerCase()}`,
}));

export const Footer: React.FC<Props> = ({
  allTodos,
  selected,
  setSelected,
  clearAll,
  completedTodos,
}) => {
  const activeTodos = allTodos.filter(todo => !todo.completed).length;

  const clearButtonClass = classNames('todoapp__clear-completed', {
    disabled: completedTodos === 0,
  });

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <ItemsLeft activeTodos={activeTodos} />

      <nav className="filter" data-cy="Filter">
        {filters.map(({ title, type, href }) => (
          <a
            key={type}
            href={href}
            className={classNames('filter__link', {
              selected: selected === type,
            })}
            data-cy={`FilterLink${title}`}
            onClick={() => setSelected(type)}
          >
            {title}
          </a>
        ))}
      </nav>

      <button
        onClick={clearAll}
        type="button"
        className={clearButtonClass}
        data-cy="ClearCompletedButton"
        disabled={completedTodos === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
