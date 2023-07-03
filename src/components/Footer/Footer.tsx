import React from 'react';
import classNames from 'classnames';
import { SortType } from '../../types/SortType';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[],
  sortMethods: string[],
  sortType: SortType,
  filterChange: (
    methodSort: string,
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,) => void,
  clearCompletedTodos: () => void

}

export const Footer: React.FC<Props> = ({
  todos,
  sortMethods,
  sortType,
  filterChange,
  clearCompletedTodos,
}) => {
  const isVisible = () => {
    return todos.some(todo => todo.completed);
  };

  return (
    <>
      {todos.length !== 0 && (
        <footer className="todoapp__footer">
          <span className="todo-count">
            {`${todos.length} items left`}
          </span>

          <nav className="filter">
            {sortMethods.map(method => (
              <a
                key={method}
                href={`#/${method}`}
                className={classNames(
                  'filter__link',
                  { selected: sortType === method },
                )}
                onClick={(event) => filterChange(method, event)}
              >
                {method}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="todoapp__clear-completed"
            onClick={() => clearCompletedTodos()}
            style={{ visibility: isVisible() ? 'visible' : 'hidden' }}
          >
            Clear completed
          </button>

        </footer>
      )}
    </>
  );
};
