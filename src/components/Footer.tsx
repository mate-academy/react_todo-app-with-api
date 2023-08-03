import classNames from 'classnames';
import React, { useMemo, useState } from 'react';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

type Props = {
  todos: Todo[],
  onHandleFilterChange: React.Dispatch<React.SetStateAction<Filter>>,
  onClear: (todoId: number) => void,
};

export const Footer: React.FC<Props> = ({
  todos,
  onHandleFilterChange,
  onClear,
}) => {
  const [selectedLink, setSelectedLink] = useState<string | null>('All');

  const handleChange = (filterType: Filter) => (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();
    const selectedLinkText = event.currentTarget.textContent;

    setSelectedLink(selectedLinkText);
    onHandleFilterChange(filterType);
  };

  const countItemsLeft = useMemo(() => {
    const count = [...todos]
      .filter(todo => !todo.completed).length;

    return count;
  }, [todos]);

  const completedItems = useMemo(() => todos
    .filter(todo => todo.completed), [todos]);

  const handleClear = () => {
    completedItems.forEach(todo => onClear(todo.id));
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${countItemsLeft} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selectedLink === 'All',
          })}
          onClick={handleChange(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectedLink === 'Active',
          })}
          onClick={handleChange(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectedLink === 'Completed',
          })}
          onClick={handleChange(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          'is-invisible': completedItems.length < 1,
        })}
        onClick={handleClear}
      >
        Clear completed
      </button>
    </footer>
  );
};
