import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoFilter } from '../../types/TodoFilter';

type Props = {
  todos: Todo[],
  todoFilter: TodoFilter,
  setTodoFilter: (filter: TodoFilter) => void,
  deleteTodosCompleted: () => void,
};

export const Footer: React.FC<Props> = ({
  todos,
  todoFilter,
  setTodoFilter,
  deleteTodosCompleted,
}) => {
  const itemsLeft = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);

  const select = (filter: TodoFilter) => {
    return () => setTodoFilter(filter);
  };

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
          onClick={select(TodoFilter.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: todoFilter === TodoFilter.ACTIVE },
          )}
          onClick={select(TodoFilter.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: todoFilter === TodoFilter.COMPLETED },
          )}
          onClick={select(TodoFilter.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {completedTodos.length > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={deleteTodosCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
