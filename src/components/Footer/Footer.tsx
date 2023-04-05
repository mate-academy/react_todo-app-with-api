import { FC, memo } from 'react';
import './Footer.scss';
import classNames from 'classnames';
import { FooterFilterLink } from '../FooterFilterLink';
import { FilteringMethod } from '../../types/FilteringStatus';
import { CountPerStatus } from '../../utils/functions';

type Props = {
  filterStatus: FilteringMethod;
  onStatusChange: (status: FilteringMethod) => void;
  countPerStatus: CountPerStatus;
  onClearAll: () => void;
};

export const Footer: FC<Props> = memo(({
  filterStatus,
  onStatusChange,
  countPerStatus,
  onClearAll,
}) => {
  const {
    active,
    completed,
  } = countPerStatus;

  const itemOrItems = active === 1 ? 'item' : 'items';

  return (
    <footer className="Footer">
      <span className="Footer__count">
        {`${active} ${itemOrItems} left`}
      </span>

      <nav className="Footer__filter">
        {Object.values(FilteringMethod).map(link => (
          <FooterFilterLink
            key={link}
            name={link}
            filterStatus={filterStatus}
            onStatusChange={onStatusChange}
          />
        ))}
      </nav>

      <button
        type="button"
        className={classNames(
          'Footer__clear-completed',
          { 'Footer__clear-completed--invisible': completed === 0 },
        )}
        onClick={onClearAll}
      >
        Clear completed
      </button>
    </footer>
  );
});
