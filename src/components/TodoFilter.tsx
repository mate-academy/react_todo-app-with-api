import React from 'react';
import cn from 'classnames';
import { EnumTodoFilter } from '../types';

interface Props {
  filter: EnumTodoFilter;
  onChangeFilter: (filter: EnumTodoFilter) => void;
}

export const TodoFilter: React.FC<Props> = ({ filter, onChangeFilter }) => (
  <nav className="filter">
    <a
      href="#/"
      className={cn('filter__link', {
        selected: filter === EnumTodoFilter.ALL,
      })}
      onClick={(event) => {
        event.preventDefault();
        onChangeFilter(EnumTodoFilter.ALL);
      }}
    >
      All
    </a>

    <a
      href="#/active"
      className={cn('filter__link', {
        selected: filter === EnumTodoFilter.ACTIVE,
      })}
      onClick={(event) => {
        event.preventDefault();
        onChangeFilter(EnumTodoFilter.ACTIVE);
      }}
    >
      Active
    </a>

    <a
      href="#/completed"
      className={cn('filter__link', {
        selected: filter === EnumTodoFilter.COMPLETED,
      })}
      onClick={(event) => {
        event.preventDefault();
        onChangeFilter(EnumTodoFilter.COMPLETED);
      }}
    >
      Completed
    </a>
  </nav>
);
