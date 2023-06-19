import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoFilter } from '../../types/TodoFilter';

type Props = {
  todos: Todo[],
  todoFilter: TodoFilter,
  setTodoFilter: (filter: TodoFilter) => void,
  deleteTodosCompleted: (completedId: number[]) => void,
  completedId: number[],
};

export const Footer: React.FC<Props> = ({
  todos,
  todoFilter,
  setTodoFilter,
  deleteTodosCompleted,
  completedId,
}) => {
  const itemsLeft = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: todoFilter === TodoFilter.ALL },
          )}
          onClick={() => setTodoFilter(TodoFilter.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: todoFilter === TodoFilter.ACTIVE },
          )}
          onClick={() => setTodoFilter(TodoFilter.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: todoFilter === TodoFilter.COMPLETED },
          )}
          onClick={() => setTodoFilter(TodoFilter.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {completedId.length > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => deleteTodosCompleted(completedId)}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
