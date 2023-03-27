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
    <section className="flex gap-2 flex-wrap mt-2">
      <nav className="btn-group shadow-md grow flex">
        <button
          type="button"
          className={classNames(
            'btn',
            'btn-sm',
            'btn-secondary',
            'grow',
            {
              'btn-active': filterType === FilterType.All,
            },
          )}
          onClick={() => changeFilterType(FilterType.All)}
        >
          <a href="#/">All</a>
        </button>

        <button
          type="button"
          className={classNames(
            'btn',
            'btn-sm',
            'btn-secondary',
            'grow',
            {
              'btn-active': filterType === FilterType.Active,
            },
          )}
          onClick={() => changeFilterType(FilterType.Active)}
        >
          <a href="#/active">Active</a>
        </button>

        <button
          type="button"
          className={classNames(
            'btn',
            'btn-sm',
            'btn-secondary',
            'grow',
            {
              'btn-active': filterType === FilterType.Completed,
            },
          )}
          onClick={() => changeFilterType(FilterType.Completed)}
        >
          <a href="#/completed">Completed</a>
        </button>
      </nav>

      <nav className="flex gap-2 grow flex-wrap">
        <button
          type="button"
          className="btn btn-secondary btn-sm shadow-md grow flex gap-2"
          disabled={!isAnyActiveTodos}
          aria-label="toggle-button"
        >
          <i className="fa-solid fa-check-double fa-md text-primary" />
          <span>Check All</span>
        </button>

        <button
          type="button"
          className="btn btn-sm btn-primary shadow-md grow"
          disabled={completedTodosCount < 1}
          onClick={onClearCompleted}
        >
          Clear completed
        </button>
      </nav>
    </section>
  );
};
