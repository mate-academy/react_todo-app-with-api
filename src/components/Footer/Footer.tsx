import cn from 'classnames';
import classNames from 'classnames';

type Filter = {
  key: string;
  label: string;
  link: string;
  dataCy: string;
};

const FILTERS: Filter[] = [
  { key: 'all', label: 'All', link: '#/', dataCy: 'FilterLinkAll' },
  {
    key: 'active',
    label: 'Active',
    link: '#/active',
    dataCy: 'FilterLinkActive',
  },
  {
    key: 'completed',
    label: 'Completed',
    link: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
];

interface Props {
  filter: string;
  onFilterChange: (filter: string) => void;
  onClearCompleted: () => void;
  incompleteCount: number;
  hasCompletedTodos: boolean;
}

export const Footer: React.FC<Props> = ({
  filter,
  onFilterChange,
  onClearCompleted,
  incompleteCount,
  hasCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${incompleteCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTERS.map(FILTER => {
          return (
            <a
              href={FILTER.link}
              className={classNames('filter__link', {
                selected: filter === FILTER.key,
              })}
              data-cy={FILTER.dataCy}
              onClick={() => onFilterChange(FILTER.key)}
              key={FILTER.key}
            >
              {FILTER.label}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className={cn('todoapp__clear-completed')}
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
