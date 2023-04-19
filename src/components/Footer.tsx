import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';

type Props = {
  todosToShow: Todo[],
  selectedStatus: Status,
  setSelectedStatus: (value:Status) => void,
  onRemoveTodoCompleted:() => void;
  completedTodos: Todo[],
};

export const Footer: React.FC<Props> = ({
  todosToShow,
  selectedStatus,
  setSelectedStatus,
  onRemoveTodoCompleted,
  completedTodos,
}) => {
  const todosLeft = todosToShow.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todosLeft} items left`}
      </span>
      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === Status.All },
          )}
          onClick={() => setSelectedStatus(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === Status.Active },
          )}
          onClick={() => setSelectedStatus(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === Status.Completed },
          )}
          onClick={() => setSelectedStatus(Status.Completed)}
        >
          Completed
        </a>
      </nav>
      {completedTodos.length > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={onRemoveTodoCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
