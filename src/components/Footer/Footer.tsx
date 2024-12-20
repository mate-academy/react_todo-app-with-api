/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

import { Todo } from '../../types/Todo';
import { FilterOptions } from '../../types/FilterOptions';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  currentFilter: string;
  setCurrentFilter: (currentFilter: string) => void;
  loading: boolean;
};

export const Footer: React.FC<Props> = ({
  todos,
  onDelete,
  currentFilter,
  setCurrentFilter,
  loading,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed).length;

  const handleClearCompleted = () => {
    const completedTodoId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    completedTodoId.forEach(todo => {
      onDelete(todo);
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterOptions).map(option => (
          <a
            key={option}
            href={`#/${option}`}
            className={classNames('filter__link', {
              selected: currentFilter === option,
            })}
            data-cy={`FilterLink${option}`}
            onClick={() => setCurrentFilter(option)}
          >
            {option}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => handleClearCompleted()}
        disabled={todos.every(todo => !todo.completed) || loading}
      >
        Clear completed
      </button>
    </footer>
  );
};
