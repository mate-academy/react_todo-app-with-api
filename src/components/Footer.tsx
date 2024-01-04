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
          id={Filter.all}
          href="#/"
          className={cn('filter__link', {
            selected: selectedFilter === Filter.all,
          })}
          data-cy="FilterLinkAll"
          onClick={changeFilter}
        >
          {Filter.all}
        </a>

        <a
          id={Filter.active}
          href="#/active"
          className={cn('filter__link', {
            selected: selectedFilter === Filter.active,
          })}
          data-cy="FilterLinkActive"
          onClick={changeFilter}
        >
          {Filter.active}
        </a>

        <a
          id={Filter.completed}
          href="#/completed"
          className={cn('filter__link', {
            selected: selectedFilter === Filter.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={changeFilter}
        >
          {Filter.completed}
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
