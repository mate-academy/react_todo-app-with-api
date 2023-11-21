import classNames from 'classnames';
import React from 'react';

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
  const { todos, handleDeleteTodo } = useTodo();

  const completedTodos = todos.filter(({ completed }) => completed);

  const onDeleteCompletedTodos = async () => {
    await Promise.all(completedTodos
      .map(({ id }) => handleDeleteTodo(id)));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length === 1
          ? '1 item left'
          : `${activeTodos.length} items left`}
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
          'is-invisible': !completedTodos.length,
        })}
        data-cy="ClearCompletedButton"
        onClick={onDeleteCompletedTodos}
        disabled={!completedTodos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
