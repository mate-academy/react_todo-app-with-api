import cn from 'classnames';
import { useContext } from 'react';
import { AppContext } from '../../AppContext';
import { FilterType } from '../../types/FilterType';
import { ContextKey } from '../../types/Context';

interface Props {
  clearCompleted: () => void;
}

export const Footer = ({
  clearCompleted,
}: Props) => {
  const { state, changeState, todosFromServer } = useContext(AppContext);

  const AmountOfTodosToComplete = todosFromServer.reduce(
    (sum, todo) => sum + +!todo.completed,
    0,
  );

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${AmountOfTodosToComplete} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: state.selectedFilter === FilterType.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => changeState(ContextKey.SelectedFilter, FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: state.selectedFilter === FilterType.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => changeState(
            ContextKey.SelectedFilter,
            FilterType.Active,
          )}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: state.selectedFilter === FilterType.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => changeState(
            ContextKey.SelectedFilter,
            FilterType.Completed,
          )}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todosFromServer.every(todo => !todo.completed)}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
