import clsx from '../../../node_modules/clsx';
import React from 'react';
import { Filter, Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  filter: Filter;
  checkTodoCompleted: () => boolean;
  removeCompletedTodos: () => void;
  handleClick: (
    event: React.MouseEvent<HTMLAnchorElement>,
    filterBy: Filter,
  ) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  checkTodoCompleted,
  removeCompletedTodos,
  handleClick,
}) => {
  const itemsLeft = todos.filter(item => !item.completed).length;
  const hasCompletedTodos = !checkTodoCompleted() && todos.length > 0;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft} items left
      </span>
      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(value => (
          <a
            key={value}
            href="#/"
            className={clsx('filter__link', {
              selected: filter === value,
            })}
            data-cy={`FilterLink${value[0].toUpperCase() + value.slice(1)}`}
            onClick={event => handleClick(event, value)}
          >
            {value}
          </a>
        ))}
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={removeCompletedTodos}
        disabled={hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
