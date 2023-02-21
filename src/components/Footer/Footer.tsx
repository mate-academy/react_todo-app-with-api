import React, { useContext } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Status';
import { TodosContext } from '../TodosProvider';

type Props = {
  todos: Todo[];
};
export const Footer: React.FC<Props> = ({ todos }) => {
  const itemsLeft = todos.filter(todo => !todo.completed).length;
  const completed = todos.filter(todo => todo.completed);

  console.log(completed);

  const {
    handleFilter,
    filter,
    clearAll,
  } = useContext(TodosContext);

  const handleClick = (value: Filter) => {
    handleFilter(value);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn(
            'filter__link',
            {
              selected: filter === Filter.ALL,
            },
          )}
          onClick={() => {
            handleClick(Filter.ALL);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn(
            'filter__link',
            {
              selected: filter === Filter.ACTIVE,
            },
          )}
          onClick={() => {
            handleClick(Filter.ACTIVE);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn(
            'filter__link',
            {
              selected: filter === Filter.COMPLETED,
            },
          )}
          onClick={() => {
            handleClick(Filter.COMPLETED);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={cn(
          'todoapp__clear-completed',
          {
            hidden: completed.length === 0,
          },
        )}
        onClick={() => {
          clearAll(completed);
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
