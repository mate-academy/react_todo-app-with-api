import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { Filters } from '../types/Filters';

type Props = {
  todos: Todo[],
  filterBy: Filters,
  setFilterBy: (value: Filters) => void,
  clearCompletedAll: () => Promise<void>
};

export const Footer: React.FC<Props> = ({
  todos,
  filterBy,
  setFilterBy,
  clearCompletedAll,
}) => {
  const countActiveTodos = todos.filter(t => !t.completed).length;
  const haveCompletedTodo = todos.some(t => t.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countActiveTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filters).map(item => (
          <a
            key={item}
            href={`#/${Filters.ALL ? '' : item.toLowerCase()}`}
            className={cn('filter__link', {
              selected: item === filterBy,
            })}
            data-cy={`FilterLink${item}`}
            onClick={() => setFilterBy(item)}
          >
            {item}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className={cn('todoapp__clear-completed', {
          hidden: !haveCompletedTodo,
        })}
        data-cy="ClearCompletedButton"
        onClick={clearCompletedAll}
        disabled={!haveCompletedTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};
