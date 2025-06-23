import React from 'react';
import { Filter } from '../../types/FilterType';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { FiltersLabel } from '../constants/FiltersLabel';

type Props = {
  counterValue: number;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  todos: Todo[];
  isLoading: boolean;
  removeCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  counterValue,
  filter,
  setFilter,
  todos,
  isLoading,
  removeCompleted,
}) => {
  const isTodoCompleted = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {counterValue} {counterValue === 1 ? 'item' : 'items'} left
      </span>

      <nav className="filter" data-cy="Filter">
        {FiltersLabel.map(({ value, label, cy }) => (
          <a
            key={value}
            href={`#/${value === Filter.All ? '' : value}`}
            className={classNames('filter__link', {
              selected: filter === value,
            })}
            data-cy={cy}
            onClick={event => {
              event.preventDefault();
              setFilter(value);
            }}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="clear-completed"
        onClick={removeCompleted}
        disabled={isLoading || !isTodoCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
