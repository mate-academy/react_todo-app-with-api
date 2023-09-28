// src/components/Footer/FilterTodos/FilterLink.tsx
import React from 'react';
import classNames from 'classnames';
import { Filter } from '../../../types/Filter';
import { useTodosProvider } from '../../../providers/TodosContext';

interface FilterLinkProps {
  filter: Filter;
  children: React.ReactNode;
}

export const FilterLink: React.FC<FilterLinkProps> = ({ filter, children }) => {
  const { handleSelectedFilter, activeFilter } = useTodosProvider();

  return (
    <a
      href={`#/${filter.toLowerCase()}`}
      className={classNames('filter__link', {
        selected: activeFilter === filter,
      })}
      data-cy={`FilterLink${filter}`}
      onClick={() => handleSelectedFilter(filter)}
    >
      {children}
    </a>
  );
};
