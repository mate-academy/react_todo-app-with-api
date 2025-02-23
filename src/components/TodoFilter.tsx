import React from 'react';
import { Status } from '../types/Status';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  setStatus: (status: Status) => void;
  status: Status;
  todos: Todo[];
  onDelete: (id: number) => Promise<void>;
};

export const TodoFilter: React.FC<Props> = ({
  setStatus,
  status,
  todos,
  onDelete,
}) => {
  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  const handleSeveralDeletes = () => {
    const deleteTodos: Promise<void>[] = [];

    completedTodos.forEach(todo => {
      deleteTodos.push(onDelete(todo.id));
    });

    Promise.allSettled(deleteTodos);
  };

  const filterLinks = [
    { status: Status.all, label: 'All', href: '#/' },
    { status: Status.active, label: 'Active', href: '#/active' },
    { status: Status.completed, label: 'Completed', href: '#/completed' },
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} {activeTodos.length === 1 ? 'item' : 'items'} left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Status).map((statusValue, index) => (
          <a
            key={index}
            href={filterLinks[index].href}
            className={classNames('filter__link', {
              selected: status === statusValue,
            })}
            data-cy={`FilterLink${statusValue.charAt(0).toUpperCase() + statusValue.slice(1)}`}
            onClick={() => setStatus(statusValue)}
          >
            {filterLinks[index].label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos.length}
        onClick={handleSeveralDeletes}
      >
        Clear completed
      </button>
    </footer>
  );
};
