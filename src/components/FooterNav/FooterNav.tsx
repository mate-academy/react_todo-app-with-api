import { FilterType } from '../../types/Filter';
import classNames from 'classnames';

type Props = {
  changeFilter: (newFilter: FilterType) => void;
  filter: FilterType;
};

export const FooterNav = ({ changeFilter, filter }: Props) => {
  const filterLinks = [
    {
      label: 'All',
      href: '#/',
      value: FilterType.all,
      dataCy: 'FilterLinkAll',
    },
    {
      label: 'Active',
      href: '#/active',
      value: FilterType.active,
      dataCy: 'FilterLinkActive',
    },
    {
      label: 'Completed',
      href: '#/completed',
      value: FilterType.completed,
      dataCy: 'FilterLinkCompleted',
    },
  ];

  return (
    <nav className="filter" data-cy="Filter">
      {filterLinks.map(link => (
        <a
          key={link.value}
          href={link.href}
          className={classNames('filter__link', {
            selected: filter === link.value,
          })}
          data-cy={link.dataCy}
          onClick={() => changeFilter(link.value)}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
};
