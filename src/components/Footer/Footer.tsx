import { SelectedFilter } from '../../types/SelectedFilter';
import cn from 'classnames';

type Props = {
  selected: SelectedFilter;
  itemCount: number;
  areNoneCompleted: boolean;
  onSelect?: (filterQuery: SelectedFilter) => void;
  onCompletedDelete?: () => void;
};

const getCyData = (enumFilter: SelectedFilter) => {
  switch (enumFilter) {
    case SelectedFilter.All:
      return 'FilterLinkAll';
    case SelectedFilter.Active:
      return 'FilterLinkActive';
    case SelectedFilter.Completed:
      return 'FilterLinkCompleted';
  }
};

export const Footer: React.FC<Props> = ({
  selected,
  itemCount,
  areNoneCompleted,
  onCompletedDelete = () => {},
  onSelect = () => {},
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(SelectedFilter).map(selectFilter => (
          <a
            href="#/"
            className={cn('filter__link', {
              selected: selected === selectFilter,
            })}
            data-cy={getCyData(selectFilter)}
            onClick={() => onSelect(selectFilter)}
            key={selectFilter}
          >
            {selectFilter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => onCompletedDelete()}
        disabled={areNoneCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
