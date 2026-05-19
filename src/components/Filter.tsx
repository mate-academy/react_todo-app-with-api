import classNames from 'classnames';
import { Status } from '../types/Status';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  todoStatus: Status;
  onChangeStatus: Dispatch<SetStateAction<Status>>;
};

export const Filter: React.FC<Props> = ({ todoStatus, onChangeStatus }) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(Status).map(status => (
        <a
          key={status}
          href={status === Status.All ? '#/' : `#/${status.toLowerCase()}`}
          className={classNames('filter__link', {
            selected: status === todoStatus,
          })}
          data-cy={`FilterLink${status}`}
          onClick={() => onChangeStatus(status)}
        >
          {status}
        </a>
      ))}
    </nav>
  );
};
