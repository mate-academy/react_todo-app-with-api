import React from 'react';
import classNames from 'classnames';
import { TodoStatus } from '../../types/TodoStatus';

type Props = {
  todoStatus: TodoStatus;
  setTodoStatus: (status: TodoStatus) => void;
  onClearCompleted: () => void;
  activeTodosCount: number;
  completedTodosCount: number;
};

export const Footer: React.FC<Props> = ({
  todoStatus,
  setTodoStatus,
  onClearCompleted,
  activeTodosCount,
  completedTodosCount,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {`${activeTodosCount} items left`}
    </span>

    <nav className="filter">
      <a
        href={`#/${TodoStatus.ALL}`}
        className={classNames(
          'filter__link',
          { selected: todoStatus === TodoStatus.ALL },
        )}
        onClick={() => setTodoStatus(TodoStatus.ALL)}
      >
        {TodoStatus.ALL}
      </a>

      <a
        href={`#/${TodoStatus.ACTIVE}`}
        className={classNames(
          'filter__link',
          { selected: todoStatus === TodoStatus.ACTIVE },
        )}
        onClick={() => setTodoStatus(TodoStatus.ACTIVE)}
      >
        {TodoStatus.ACTIVE}
      </a>

      <a
        href={`#/${TodoStatus.COMPLETED}`}
        className={classNames(
          'filter__link',
          { selected: todoStatus === TodoStatus.COMPLETED },
        )}
        onClick={() => setTodoStatus(TodoStatus.COMPLETED)}
      >
        {TodoStatus.COMPLETED}
      </a>
    </nav>

    {completedTodosCount > 0 && (
      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    )}
  </footer>
);
