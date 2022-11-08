import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import { ErrorType } from '../../types/ErrorType';
import { FilterBy } from '../../types/FilterBy';
import { Todo } from '../../types/Todo';
import { getVisibletodos } from '../../utils/getVisibleTodos';

const filterTypes = [
  { id: 1, type: FilterBy.ALL },
  { id: 2, type: FilterBy.ACTIVE },
  { id: 3, type: FilterBy.COMPLETED },
];

type Props = {
  onChangeVisibleTodos: (newTodos: Todo[]) => void;
  todos: Todo[];
  onChangeError: (errorType: ErrorType) => void;
};

export const TodosFilter: React.FC<Props> = ({
  onChangeVisibleTodos,
  todos,
  onChangeError,
}) => {
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.ALL);

  const setFilteredTodos = (filter: FilterBy) => {
    const filteredTodos = getVisibletodos(todos, filter);

    onChangeVisibleTodos(filteredTodos);
  };

  const handleFilterChange = (filter: FilterBy) => {
    setFilterBy(filter);
    setFilteredTodos(filter);
  };

  useEffect(() => {
    onChangeError(ErrorType.NONE);
  }, [filterBy]);

  useEffect(() => {
    setFilterBy(FilterBy.ALL);
  }, [todos]);

  return (
    <nav className="filter" data-cy="Filter">
      {filterTypes.map(filter => (
        <a
          key={filter.id}
          data-cy="FilterLinkAll"
          href="#/"
          className={cn(
            'filter__link',
            { selected: filterBy === filter.type },
          )}
          onClick={() => handleFilterChange(filter.type)}
        >
          {filter.type}
        </a>
      ))}
    </nav>
  );
};
