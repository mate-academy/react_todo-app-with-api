import classNames from 'classnames';
import { FC } from 'react';
import { FilterType } from '../../enums/FilterType';

type Props = {
  filterType: FilterType;
  completedTodosCount: number;
  isAnyActiveTodos: boolean;
  changeFilterType: (filterType: FilterType) => void;
  onClearCompleted: () => void;
};

export const TodoFilter: FC<Props> = ({
  filterType,
  completedTodosCount,
  isAnyActiveTodos,
  changeFilterType,
  onClearCompleted,
}) => {
  return (
    <section className="flex gap-2 mt-2">
      <button
        type="button"
        className="btn btn-secondary w-12 btn-sm shadow-md"
        disabled={!isAnyActiveTodos}
        aria-label="toggle-button"
      >
        <i className="fa-solid fa-check-double fa-xl" />
      </button>

      <nav className="btn-group shadow-md">
        <button
          type="button"
          className={classNames('btn', 'btn-sm', 'btn-secondary', {
            'btn-active': filterType === FilterType.All,
          })}
          onClick={() => changeFilterType(FilterType.All)}
        >
          <a href="#/">All</a>
        </button>

        <button
          type="button"
          className={classNames('btn', 'btn-sm', 'btn-secondary', {
            'btn-active': filterType === FilterType.Active,
          })}
          onClick={() => changeFilterType(FilterType.Active)}
        >
          <a href="#/active">Active</a>
        </button>

        <button
          type="button"
          className={classNames('btn', 'btn-sm', 'btn-secondary', {
            'btn-active': filterType === FilterType.Completed,
          })}
          onClick={() => changeFilterType(FilterType.Completed)}
        >
          <a href="#/completed">Completed</a>
        </button>
      </nav>

      {completedTodosCount > 0 && (
        <button
          type="button"
          className="btn btn-sm btn-primary shadow-md"
          disabled
          onClick={onClearCompleted}
        >
          Clear completed
        </button>
      )}
    </section>
  );
};
