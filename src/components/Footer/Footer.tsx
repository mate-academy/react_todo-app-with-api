import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoStatus } from '../../types/TodoStatus';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  todoStatus: TodoStatus;
  setTodoStatus: (todoStatus: TodoStatus) => void;
  onDelete: (id: number) => void;
  activeTodosArray: () => Todo[];
  completedTodosArray: () => Todo[];
};

export const Footer: React.FC<Props> = ({
  todoStatus,
  setTodoStatus,
  onDelete,
  activeTodosArray,
  completedTodosArray,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosArray().length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(TodoStatus).map(status => {
          const handleTodoStatus = () => {
            setTodoStatus(status);
          };

          return (
            <a
              href={`#/${status}`}
              className={classNames('filter__link', {
                selected: todoStatus === status,
              })}
              data-cy={`FilterLink${status}`}
              onClick={handleTodoStatus}
              key={status}
            >
              {status}
            </a>
          );
        })}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosArray().length === 0}
        onClick={() => {
          completedTodosArray().map(todo => onDelete(todo.id));
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
