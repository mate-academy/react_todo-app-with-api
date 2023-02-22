import React, { useContext } from 'react';
import cn from 'classnames';
import { Filter } from '../../types/Status';
import { TodosContext } from '../TodosProvider';

type Props = {
  filter: Filter;
  handleFilter: (value: Filter) => void;
};
export const Footer: React.FC<Props> = ({ filter, handleFilter }) => {
  const { todos, clearAll } = useContext(TodosContext);
  const itemsLeft = todos.filter(todo => !todo.completed).length;
  const completed = todos.filter(todo => todo.completed);
  const filterValues = Object.values(Filter);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter">
        {filterValues.map(filterValue => (
          <a
            key={filterValue}
            href={`#/${filterValue}`}
            className={cn(
              'filter__link',
              {
                selected: filter === filterValue,
              },
            )}
            onClick={() => {
              handleFilter(filterValue as Filter);
            }}
          >
            {filterValue}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className={cn(
          'todoapp__clear-completed',
          {
            hidden: !completed.length,
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
