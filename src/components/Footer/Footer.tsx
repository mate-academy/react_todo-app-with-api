import { STATUS_FILTER_OPTIONS, StatusFilter } from '../../types/statusFilter';
import cn from 'classnames';

type FooterProps = {
  todosLeft: number;
  status: StatusFilter;
  hasCompletedTodos: boolean;
  onStatusChange: (newStatus: StatusFilter) => void;
  onDeleteAll: () => void;
};

export const Footer: React.FC<FooterProps> = ({
  todosLeft,
  status,
  hasCompletedTodos,
  onStatusChange,
  onDeleteAll,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLeft} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {(Object.keys(STATUS_FILTER_OPTIONS) as StatusFilter[]).map(
          filterOption => {
            const { href, testId, text } = STATUS_FILTER_OPTIONS[filterOption];
            return (
              <a
                key={filterOption}
                href={href}
                className={cn('filter__link', {
                  selected: status === filterOption,
                })}
                data-cy={testId}
                onClick={() => onStatusChange(filterOption)}
              >
                {text}
              </a>
            );
          },
        )}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={onDeleteAll}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
