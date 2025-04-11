import classNames from 'classnames';
import { FilterStatus } from '../types/Todo';
import React from 'react';

type Props = {
  todoStatus: FilterStatus;
  setTodoStatus: (newTodoStatus: FilterStatus) => void;
};

const capitalize = (str: string) => str[0].toLocaleUpperCase() + str.slice(1);

// eslint-disable-next-line react/display-name
export const Filter: React.FC<Props> = React.memo(
  ({ todoStatus, setTodoStatus }: Props) => (
    <nav className="filter" data-cy="Filter">
      {Object.values(FilterStatus).map(status => (
        <a
          key={status}
          href={`#/${status === FilterStatus.ALL ? '' : status.toLocaleLowerCase()}`}
          className={classNames('filter__link', {
            selected: todoStatus === status,
          })}
          data-cy={`FilterLink${capitalize(status)}`}
          onClick={() => setTodoStatus(status)}
        >
          {status}
        </a>
      ))}
    </nav>
  ),
);
