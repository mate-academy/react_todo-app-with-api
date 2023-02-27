import classNames from 'classnames';
import React, { useMemo } from 'react';
import { FilterType } from '../../types/FilterType';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  filterType: FilterType,
  handleFilterType: (filter: FilterType) => void,
  handleCompletedTodos: () => void,
};

export const Footer: React.FC<Props> = ({
  todos,
  filterType,
  handleFilterType,
  handleCompletedTodos,
}) => {
  const todosLeft = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const todosCompleted = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todosLeft} items left`}
      </span>

      <nav className="filter">
        {Object.values(FilterType).map(type => (
          <a
            href={`#/${type}`}
            className={classNames(
              'filter__link',
              {
                selected: filterType === type,
              },
            )}
            onClick={() => handleFilterType(type)}
          >
            {type}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={() => handleCompletedTodos()}
        hidden={!todosCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
