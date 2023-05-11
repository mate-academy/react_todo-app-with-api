import classNames from 'classnames';
import { Status } from '../../../../types/Status';
import { GetStatus } from '../../../../types/functions';

interface Props {
  status: Status;
  setStatus: GetStatus;
}

export const Filter: React.FC<Props> = ({
  status,
  setStatus,
}) => (
  <nav className="filter">
    {Object.values(Status).map((item) => (
      <a
        key={item}
        href={`#/${item}`}
        className={classNames(
          'filter__link',
          { selected: status === item },
        )}
        onClick={() => setStatus(item)}
      >
        {item}
      </a>
    ))}
  </nav>
);
