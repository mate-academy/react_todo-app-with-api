import { FC } from 'react';
import cn from 'classnames';
import { useAppContext } from '../context/AppContext';
import { Filter } from '../types';

export const Footer: FC = () => {
  const {
    selectedFilter,
    changeFilter,
    completedTodosNum,
    activeTodosNum,
    clearCompleted,
  } = useAppContext();

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        { `${activeTodosNum} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          id={Filter.ALL}
          href="#/"
          className={cn('filter__link', {
            selected: selectedFilter === Filter.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={changeFilter}
        >
          {Filter.ALL}
        </a>

        <a
          id={Filter.ACTIVE}
          href="#/active"
          className={cn('filter__link', {
            selected: selectedFilter === Filter.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={changeFilter}
        >
          {Filter.ACTIVE}
        </a>

        <a
          id={Filter.COMPLETED}
          href="#/completed"
          className={cn('filter__link', {
            selected: selectedFilter === Filter.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={changeFilter}
        >
          {Filter.COMPLETED}
        </a>
      </nav>

      <button
        onClick={clearCompleted}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosNum <= 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
