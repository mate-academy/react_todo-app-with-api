import React, { useCallback, useMemo } from 'react';
import cn from 'classNames';

import { Todo } from '../../types/Todo';
import { Status } from '../../types/Status';

interface Props {
  todos: Todo[];
  status: Status;
  onSetStatus: (event: React.MouseEvent) => void;
  onClearCompleted: () => void;
}

export const TodoFilter: React.FC<Props> = ({
  todos,
  status,
  onSetStatus,
  onClearCompleted,
}) => {
  const completedTodos = useMemo(() => {
    const completed = todos.filter(todo => todo.completed).length;

    return completed;
  }, [todos]);
  const todosCounter = useMemo(() => {
    const notCompletedTodos = todos.filter(todo => !todo.completed).length;
    const message =
      notCompletedTodos === 1
        ? `${notCompletedTodos} item left`
        : `${notCompletedTodos} items left`;

    return message;
  }, [todos]);

  const isActiveButton = useCallback(
    (value: string) => value === status,
    [status],
  );

  const capitalize = useCallback((word: string) => {
    if (!word) {
      return '';
    }

    return word[0].toUpperCase() + word.slice(1).toLowerCase();
  }, []);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCounter}
      </span>

      <nav className="filter" data-cy="Filter" onClick={onSetStatus}>
        {Object.values(Status).map(statusValue => (
          <a
            href={`#/${statusValue}`}
            className={cn('filter__link', {
              selected: isActiveButton(statusValue),
            })}
            data-cy={`FilterLink${capitalize(statusValue)}`}
            key={statusValue}
          >
            {capitalize(statusValue)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={completedTodos === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
