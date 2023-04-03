import { FC } from 'react';
import classNames from 'classnames';
import { FilterType } from '../../types/FilterType';

type Props = {
  amountCompletedTodos: number,
  todosLength: number,
  filterType: FilterType,
  setFilterType: React.Dispatch<React.SetStateAction<FilterType>>,
  onClear: () => void,
};

const filterLinks = [FilterType.All, FilterType.Active, FilterType.Completed];

const Footer: FC<Props> = ({
  amountCompletedTodos: completedTodos,
  todosLength,
  filterType,
  setFilterType,
  onClear,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {completedTodos}
      {' items left'}
    </span>

    <nav className="filter">
      {filterLinks.map(type => (
        <a
          key={type}
          href={`#/${type}`}
          data-select={type}
          className={classNames(
            'filter__link',
            { selected: filterType === type },
          )}
          onClick={() => setFilterType(type)}
        >
          {type}
        </a>
      ))}
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed disabled"
      onClick={onClear}
      disabled={todosLength === completedTodos}
    >
      Clear completed
    </button>
  </footer>
);

export default Footer;
