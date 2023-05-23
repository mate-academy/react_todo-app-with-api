import cn from 'classnames';
import { TodoStatus } from '../../types/TodoStatus';

type Props = {
  onFilterSelect: (option: TodoStatus) => void;
  selectedFilter: TodoStatus;
  option: TodoStatus;
};

export const FilterItem: React.FC<Props> = ({
  onFilterSelect,
  selectedFilter,
  option,
}) => {
  return (
    <a
      key={option}
      href={`#/${option}`}
      className={cn('filter__link', {
        selected: option === selectedFilter,
      })}
      onClick={() => onFilterSelect(option)}
    >
      {option[0].toUpperCase() + option.slice(1)}
    </a>
  );
};
