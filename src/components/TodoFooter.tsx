import React from 'react';
import classNames from 'classnames';
import { FILTER_LINKS } from '../utils/constants';
import { TodoStatus } from '../types/TodoStatus';

type TodoFooterProps = {
  todoStatus: TodoStatus,
  onStatusSelect: (link: TodoStatus) => void,
  activeTodos: number,
  onClearCompleted: () => void,
  isAnyTodoCompleted: boolean,
};

export const TodoFooter: React.FC<TodoFooterProps> = ({
  todoStatus,
  onStatusSelect,
  activeTodos,
  onClearCompleted,
  isAnyTodoCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos} items left`}
      </span>
      <nav className="filter" data-cy="Filter">
        {FILTER_LINKS.map(link => (
          <a
            key={link.status}
            href={`#/${todoStatus}`}
            className={classNames('filter__link', {
              selected: todoStatus === link.status,
            })}
            data-cy={link.dataCy}
            onClick={() => {
              onStatusSelect(link.status);
            }}
          >
            {link.text}
          </a>
        ))}
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={!isAnyTodoCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
