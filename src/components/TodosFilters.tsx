import { useContext } from 'react';
import classNames from 'classnames';
import { Status } from '../types/Status';
import { TodosContext } from './TodosContext';

export const TodosFilters: React.FC = () => {
  const { status, setStatus } = useContext(TodosContext);

  return (
    <nav className="filter" data-cy="Filter">
      {(Object
        .keys(Status) as (keyof typeof Status)[])
        .map((key) => {
          const currentStatus = Status[key];

          return (
            <a
              key={key}
              href={
                currentStatus === Status.ALL
                  ? `#/${currentStatus}`
                  : '#/'
              }
              className={
                classNames('filter__link', {
                  selected: currentStatus === status,
                })
              }
              data-cy={
                `FilterLink${currentStatus}`
              }
              onClick={e => {
                e.preventDefault();
                setStatus(currentStatus);
              }}
            >
              {currentStatus}
            </a>
          );
        })}
    </nav>
  );
};
