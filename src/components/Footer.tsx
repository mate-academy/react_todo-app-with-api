import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';

type Props = {
  todos: Todo[],
  todosToShow: Todo[],
  selectedStatus: Status,
  setSelectedStatus: (value:Status) => void,
  onRemoveTodoCompleted:() => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  todosToShow,
  selectedStatus,
  setSelectedStatus,
  onRemoveTodoCompleted,

}) => {
  const todosLeft = todosToShow.filter(todo => !todo.completed).length;
  const isCompleted = todos.some(todo => todo.completed);

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
      <button
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          { 'todoapp__clear-completed-hidden': !isCompleted },
        )}
        onClick={onRemoveTodoCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
