import classNames from 'classnames';
import { FilterOptions } from '../../types/FilterOptions';

interface Props {
  filteredBy: FilterOptions,
  onOptionChange: (option: FilterOptions) => void,
}

export const TodoFilter: React.FC<Props> = ({
  filteredBy,
  onOptionChange,
}) => {
  const options = Object.keys(FilterOptions) as (keyof typeof FilterOptions)[];

  return (
    <nav className="filter" data-cy="Filter">
      {options.map(option => (
        <a
          key={option}
          data-cy={`FilterLink${option}`}
          href={`#/${FilterOptions[option]}`}
          className={classNames(
            'filter__link',
            { selected: filteredBy === FilterOptions[option] },
          )}
          onClick={() => {
            onOptionChange(FilterOptions[option]);
          }}
        >
          {option}
        </a>
      ))}
    </nav>
  );
};
