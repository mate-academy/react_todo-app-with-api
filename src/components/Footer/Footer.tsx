import classNames from 'classnames';
import React, { useMemo } from 'react';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';

type Props = {
  todos: Todo[];
  filterType: FilterType;
  setFilterType: React.Dispatch<React.SetStateAction<FilterType>>;
  onDeleteCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = (props: Props) => {
  const { todos, filterType, setFilterType, onDeleteCompletedTodos } = props;

  const todosLeft = useMemo((): Todo[] => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  const todosCompleted = useMemo((): Todo[] => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const filterOptions = [
    { label: 'All', value: FilterType.All, href: '#/' },
    { label: 'Active', value: FilterType.Active, href: '#/active' },
    { label: 'Completed', value: FilterType.Completed, href: '#/completed' },
  ];

  return (
    <footer className={classNames('todoapp__footer')} data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLeft.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterOptions.map(option => (
          <a
            key={option.value}
            href={option.href}
            className={classNames('filter__link', {
              selected: filterType === option.value,
            })}
            data-cy={`FilterLink${option.label}`}
            onClick={() => {
              setFilterType(option.value);
            }}
          >
            {option.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todosCompleted.length}
        onClick={onDeleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
