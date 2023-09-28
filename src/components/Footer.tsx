import classNames from 'classnames';
import React, { useMemo } from 'react';

import { Todo } from '../types/Todo';
import { FilterOption } from '../types/FilterOptions';
import { useTodo } from '../hooks/useTodo';

type Props = {
  activeTodos: Todo[],
  filter: string,
  setFilter: (filter: string) => void,
};

export const Footer: React.FC<Props> = ({
  activeTodos,
  filter,
  setFilter,
}) => {
  const { todos, deleteTodoHandler } = useTodo();

  const completedTodos = useMemo(() => {
    return todos.filter(({ completed }) => completed === true);
  }, [todos]);

  const handleDeleteCompletedTodos = () => {
    Promise.all(completedTodos
      .map(({ id }) => deleteTodoHandler(id)));
  };

  const isClearButtonInvisible = completedTodos.length === 0;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length > 1
          ? `${activeTodos.length} items left`
          : '1 item left'}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterOption).map((option) => (
          <a
            key={option}
            data-cy={`FilterLink${option}`}
            href={`#/${option.toLowerCase()}`}
            className={classNames(
              'filter__link',
              { selected: option === filter },
            )}
            onClick={() => setFilter(option)}
          >
            {option}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          'is-invisible': isClearButtonInvisible,
        })}
        data-cy="ClearCompletedButton"
        onClick={handleDeleteCompletedTodos}
        disabled={isClearButtonInvisible}
      >
        Clear completed
      </button>
    </footer>
  );
};
