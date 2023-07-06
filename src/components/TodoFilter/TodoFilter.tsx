import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import cn from 'classnames';
import { TodoStatusFilter } from '../../types/TodoStatusFilter';

export const TodoFilter: FC = () => (
  <nav className="filter">
    {Object.entries(TodoStatusFilter).map(([key, value]) => (
      <NavLink
        key={key}
        to={`${value}`}
        className={({ isActive }) => cn('filter__link', {
          selected: isActive,
        })}
      >
        {key}
      </NavLink>
    ))}
  </nav>
);
