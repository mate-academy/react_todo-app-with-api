import { useContext } from 'react';
import { todosContext } from '../../../Store';
import classNames from 'classnames';
import { Filter } from '../../../types/Filter';
import { getButtonText } from '../../../utils/utils';

interface Props {
  value: Filter;
}

export const FilterItem: React.FC<Props> = ({ value }) => {
  const { state, setters } = useContext(todosContext);
  const { filter } = state;
  const { setFilter } = setters;
  const isSelected = filter === value;
  const link = value !== Filter.all ? `#/${value}` : `#/`;
  const buttonText = getButtonText(value);

  return (
    <a
      href={link}
      className={classNames('filter__link', { selected: isSelected })}
      data-cy={`FilterLink${buttonText}`}
      onClick={() => setFilter(value)}
    >
      {buttonText}
    </a>
  );
};
