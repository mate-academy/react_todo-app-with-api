import React from 'react';
import { SortTypes } from '../types/Todo';

type Props = {
  handleSort: (type: SortTypes) => void;
  sortType: SortTypes;
};

const typesOfButton = ['all', 'active', 'completed'] as const;

export const TodoFilter: React.FC<Props> = ({ handleSort, sortType }) => {
  const firstLetterUp
  = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  return (
    <nav className="filter" data-cy="Filter">
      {typesOfButton.map((type: SortTypes) => (
        <a
          href="#/"
          className={`filter__link ${type.toLowerCase() === sortType ? 'selected' : ''}`}
          data-cy={`FilterLink${firstLetterUp(type)}`}
          key={type}
          onClick={() => handleSort(type)}
        >
          {firstLetterUp(type)}
        </a>
      ))}
    </nav>
  );
};
