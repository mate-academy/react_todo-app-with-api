import { Dispatch, FC, SetStateAction } from 'react';
import classNames from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  filter: string,
  setFilter: Dispatch<SetStateAction<Filter>>,
  itemsLeft: number,
  hasOneCompletedTodo: boolean,
  handleClearCompleted: () => void,
};

export const TodoFooter: FC<Props> = ({
  filter,
  setFilter,
  itemsLeft,
  hasOneCompletedTodo,
  handleClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${itemsLeft} ${itemsLeft > 1 ? 'items left' : 'item left'}`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === Filter.ALL,
          })}
          onClick={() => setFilter(Filter.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === Filter.ACTIVE,
          })}
          onClick={() => setFilter(Filter.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === Filter.COMPLETED,
          })}
          onClick={() => setFilter(Filter.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {hasOneCompletedTodo && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
