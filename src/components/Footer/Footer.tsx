import React from 'react';
import classNames from 'classnames';
import { FilterComponent } from '../FilterComponent';
import { SortType } from '../../types/SortType';
import { Todo } from '../../types/Todo';

type Props = {
  sortType: SortType,
  sortBy: {
    sortByAll: () => void,
    sortByActive: () => void,
    sortByCompleted: () => void,
  }
  todos: Todo[],
  removeCompleted: () => void,
  activeTodos: Todo[],
};

export const Footer: React.FC<Props> = ({
  sortType,
  sortBy,
  todos,
  removeCompleted,
  activeTodos,
}) => {
  const hasCompletedTodos = !!todos.filter((todo) => todo.completed).length;

  return (
    <footer className={classNames(
      'todoapp__footer', {
        'todoapp__footer--hidden': !todos.length,
      },
    )}
    >
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      <FilterComponent
        sortType={sortType}
        sortBy={sortBy}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={!hasCompletedTodos}
        onClick={removeCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
