import classNames from 'classnames';
import React, { useMemo } from 'react';

import { SortType } from '../../types/SortType';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  sortType: SortType;
  setSortType: (item: SortType) => void;
  clearCompletedTodos: () => void;
};

const sortTypeArray = Object.values(SortType);

export const Footer: React.FC<Props> = ({
  todos,
  sortType,
  setSortType,
  clearCompletedTodos,
}) => {
  const todosLeft = useMemo(() => (
    todos.reduce((acc: Todo[], cur) => {
      if (!cur.completed) {
        acc.push(cur);
      }

      return acc;
    }, []).length
  ), [todos]);

  const completedTodos = useMemo(() => (
    todos.reduce((acc: Todo[], cur) => {
      if (cur.completed) {
        acc.push(cur);
      }

      return acc;
    }, []).length
  ), [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {sortTypeArray.map(type => (
          <a
            key={type}
            data-cy={`FilterLink${type}`}
            href={`#/${type}`}
            className={classNames(
              'filter__link',
              { selected: sortType === type },
            )}
            onClick={() => setSortType(type)}
          >
            {type}
          </a>
        ))}
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          { hide: !completedTodos },
        )}
        onClick={clearCompletedTodos}
        disabled={!completedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
