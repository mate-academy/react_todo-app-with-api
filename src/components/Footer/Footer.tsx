import classNames from 'classnames';
import React from 'react';
import { filterLinks } from '../../helper/filterLinks';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';

interface Props {
  filter: Filter,
  onFilterChange: (filter: Filter) => void,
  completedTodos: Todo[],
  activeTodosCount: number,
  deleteCompleted: (todos: Todo[]) => void,
}

export const Footer: React.FC<Props> = React.memo(
  ({
    filter,
    onFilterChange,
    completedTodos,
    activeTodosCount,
    deleteCompleted,
  }) => {
    return (
      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${activeTodosCount} items left`}
        </span>

        <nav className="filter">
          {filterLinks.map(link => (
            <button
              className="todoapp__footer__button"
              type="button"
              onClick={() => onFilterChange(link.title)}
            >
              <a
                key={link.title}
                href={`#/${link.url}`}
                className={classNames(
                  'filter__link',
                  { selected: filter === link.title },
                )}
              >
                {link.title}
              </a>
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          disabled={!completedTodos.length}
          onClick={() => deleteCompleted(completedTodos)}
        >
          Clear completed
        </button>
      </footer>
    );
  },
);
