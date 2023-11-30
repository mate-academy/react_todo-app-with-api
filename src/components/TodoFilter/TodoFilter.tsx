import React from 'react';
import classNames from 'classnames';
import { TodoStatus } from '../../types';
import { useTodoContext } from '../../TodoContext';

type Props = {
  selectStatus: (status: TodoStatus) => void;
  status: TodoStatus;
};

export const TodoFilter: React.FC<Props> = ({
  selectStatus,
  status,
}) => {
  const {
    completedTodos,
    clearAllCompleted,
    uncompletedTodosLength,
  } = useTodoContext();

  const singularityCheck = uncompletedTodosLength !== 1
    ? 's'
    : '';

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${uncompletedTodosLength} item${singularityCheck} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.entries(TodoStatus).map(([key, value]) => (
          <a
            key={key}
            href={`#/${value}`}
            className={classNames(
              'filter__link', {
                selected: value === status,
              },
            )}
            onClick={() => selectStatus(value as TodoStatus)}
            data-cy={`FilterLink${key}`}
          >
            {key}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        style={{ visibility: completedTodos.length ? 'visible' : 'hidden' }}
        onClick={clearAllCompleted}
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
