import { FC } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { FilterStatusEnum } from '../types/Status.enum';

interface Props {
  activeTodosCount: number;
  completedTodos: Todo[];
  filterStatus: FilterStatusEnum;
  onStatusChange: (status: FilterStatusEnum) => void;
  clearCompletedTodos: () => void;
}

export const Footer: FC<Props> = ({
  activeTodosCount,
  completedTodos,
  filterStatus,
  onStatusChange,
  clearCompletedTodos,
}) => {
  const isOneTodoCompleted = completedTodos.length > 0;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          data-cy="FilterLinkAll"
          className={classNames('filter__link', {
            selected: filterStatus === FilterStatusEnum.All,
          })}
          onClick={() => onStatusChange(FilterStatusEnum.All)}
        >
          All
        </a>

        <a
          href="#/active"
          data-cy="FilterLinkActive"
          className={classNames('filter__link', {
            selected: filterStatus === FilterStatusEnum.Active,
          })}
          onClick={() => onStatusChange(FilterStatusEnum.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          data-cy="FilterLinkCompleted"
          className={classNames('filter__link', {
            selected: filterStatus === FilterStatusEnum.Completed,
          })}
          onClick={() => onStatusChange(FilterStatusEnum.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        disabled={!isOneTodoCompleted}
        onClick={clearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
