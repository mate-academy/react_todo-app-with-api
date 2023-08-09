import { FC } from 'react';
import cn from 'classnames';
import { Filters } from '../../types/Filters';

interface Props {
  todoFilter: Filters
  onChangeFilter: (filter: Filters) => void;
}

export const Filter: FC<Props> = ({ todoFilter, onChangeFilter }) => (
  <nav className="filter">
    <a
      href="#/"
      className={cn('filter__link ', {
        selected: todoFilter === Filters.ALL,
      })}
      onClick={() => onChangeFilter(Filters.ALL)}
    >
      All
    </a>

    <a
      href="#/active"
      className={cn('filter__link ', {
        selected: todoFilter === Filters.ACTIVE,
      })}
      onClick={() => onChangeFilter(Filters.ACTIVE)}
    >
      Active
    </a>

    <a
      href="#/completed"
      className={cn('filter__link ', {
        selected: todoFilter === Filters.COMPLETED,
      })}
      onClick={() => onChangeFilter(Filters.COMPLETED)}
    >
      Completed
    </a>
  </nav>
);
