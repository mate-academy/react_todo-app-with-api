import classNames from 'classnames';
import { Dispatch, SetStateAction } from 'react';
import { FilterTodoBy } from '../../types/FilterTodoBy';

type Props = {
  hasCompletedTodos: boolean;
  activeTodosCount: number;
  filterBy: FilterTodoBy;
  changeFilterBy: Dispatch<SetStateAction<FilterTodoBy>>;
  onCompletedDelete: () => void
};

export const TodoFilter: React.FC<Props> = (props) => {
  const {
    hasCompletedTodos,
    activeTodosCount,
    filterBy,
    changeFilterBy,
    onCompletedDelete,
  } = props;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter">
        {Object.values(FilterTodoBy).map(value => (
          <a
            href={`#/${value}`}
            key={value}
            className={classNames('filter__link', {
              selected: value === filterBy,
            })}
            onClick={() => changeFilterBy(value)}
          >
            {value}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={onCompletedDelete}
        style={{
          visibility: `${hasCompletedTodos ? 'visible' : 'hidden'}`,
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
