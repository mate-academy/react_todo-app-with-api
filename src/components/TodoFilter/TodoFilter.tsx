import { FC } from 'react';
import classNames from 'classnames';
import { FilterTypeButton } from '../FilterTypeButton';
import { FilterType } from '../../enums/FilterType';

type FilterProps = {
  currentFilterType: FilterType;
  isAnyCompletedTodos: boolean;
  isAnyActiveTodos: boolean;
  changeFilterType: (filterType: FilterType) => void;
  onClearCompleted: () => void;
  onToggleAllTodos: () => void;
};

export const TodoFilter: FC<FilterProps> = ({
  currentFilterType,
  isAnyCompletedTodos,
  isAnyActiveTodos,
  changeFilterType,
  onClearCompleted,
  onToggleAllTodos,
}) => {
  return (
    <section className="flex gap-2 flex-wrap mt-2">
      <nav className="btn-group shadow-md grow basis-5/6 flex">
        <FilterTypeButton
          title="All"
          filterType={FilterType.All}
          isActive={currentFilterType === FilterType.All}
          changeFilterType={changeFilterType}
        />
        <FilterTypeButton
          title="Active"
          filterType={FilterType.Active}
          isActive={currentFilterType === FilterType.Active}
          changeFilterType={changeFilterType}
        />
        <FilterTypeButton
          title="Completed"
          filterType={FilterType.Completed}
          isActive={currentFilterType === FilterType.Completed}
          changeFilterType={changeFilterType}
        />
      </nav>

      <nav className="flex gap-2 grow flex-wrap">
        <button
          type="button"
          className={classNames(
            'btn btn-sm shadow-md grow flex gap-2',
            {
              'btn-ghost': isAnyActiveTodos,
              'btn-secondary': !isAnyActiveTodos,
            },
          )}
          aria-label="toggle-button"
          onClick={onToggleAllTodos}
        >
          <i className="fa-solid fa-check-double fa-md text-primary" />

          <span>Check All</span>
        </button>
        <button
          type="button"
          className="btn btn-sm btn-primary shadow-md grow"
          disabled={!isAnyCompletedTodos}
          onClick={onClearCompleted}
        >
          Clear completed
        </button>
      </nav>
    </section>
  );
};
