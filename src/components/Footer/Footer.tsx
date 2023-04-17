import classNames from 'classnames';

import { SortType } from '../../types/SortType';

type Props = {
  sortType: SortType,
  activeTodoListLength: number,
  completedTodoListLength: number,
  onSetSortType: (sortBy: SortType) => void;
  removeCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  sortType,
  onSetSortType,
  activeTodoListLength,
  completedTodoListLength,
  removeCompletedTodos,
}) => {
  const handleSortType = (value: string) => {
    switch (value) {
      case 'ALL':
        onSetSortType(SortType.ALL);
        break;
      case 'COMPLETE':
        onSetSortType(SortType.COMPLETE);
        break;
      case 'ACTIVE':
        onSetSortType(SortType.ACTIVE);
        break;
      default:
        break;
    }
  };

  const sortTypeEntries = Object.entries(SortType);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodoListLength} items left`}
      </span>

      <nav className="filter">
        {sortTypeEntries.map(item => (
          <a
            href="#/"
            className={classNames(
              'filter__link', { selected: sortType === item[1] },
            )}
            key={item[1]}
            onClick={() => {
              handleSortType(item[0]);
            }}
          >
            {item[1]}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        style={{
          visibility: completedTodoListLength
            ? 'visible'
            : 'hidden',
        }}
        onClick={removeCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
