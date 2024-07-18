import React from 'react';
import { Completed } from '../../types/Filters';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  filterParam: Completed;
  todos: Todo[];
  deletingCompleted: boolean;
  onSetParam: (val: Completed) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  filterParam,
  todos,
  deletingCompleted,
  onSetParam,
  onClearCompleted,
}) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const hasTodoCompleted = todos.some(todo => todo.completed);

  return (
    <>
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {activeTodosCount} items left
        </span>

        <nav className="filter" data-cy="Filter">
          <a
            href="#/"
            className={cn('filter__link', {
              selected: filterParam === Completed.All,
            })}
            data-cy="FilterLinkAll"
            onClick={() => onSetParam(Completed.All)}
          >
            All
          </a>

          <a
            href="#/active"
            className={cn('filter__link', {
              selected: filterParam === Completed.Active,
            })}
            data-cy="FilterLinkActive"
            onClick={() => onSetParam(Completed.Active)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={cn('filter__link', {
              selected: filterParam === Completed.Completed,
            })}
            data-cy="FilterLinkCompleted"
            onClick={() => onSetParam(Completed.Completed)}
          >
            Completed
          </a>
        </nav>

        <button
          type="button"
          className={cn('todoapp__clear-completed', {
            'button-hidden': !hasTodoCompleted,
          })}
          data-cy="ClearCompletedButton"
          onClick={onClearCompleted}
          disabled={deletingCompleted || !hasTodoCompleted}
        >
          Clear completed
        </button>
      </footer>
    </>
  );
};
