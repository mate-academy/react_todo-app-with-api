import cn from 'classnames';
import { memo, useCallback, useContext } from 'react';
import { DispatchContext, StateContext } from '../../store/store';
import { ActionType } from '../../types/ActionType';
import { Filters } from '../../types/Filters';

export const TodosFilter:React.FC = memo(() => {
  const { filter: todosFilter } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const handleSelectedTodos = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      switch (event.currentTarget.textContent) {
        case Filters.Active:
          dispatch({
            type: ActionType.SetFilter,
            payload: Filters.Active,
          });
          break;

        case Filters.Completed:
          dispatch({
            type: ActionType.SetFilter,
            payload: Filters.Completed,
          });
          break;

        default:
          dispatch({
            type: ActionType.SetFilter,
            payload: Filters.All,
          });
          break;
      }
    }, [dispatch],
  );

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        data-cy="FilterLinkAll"
        className={cn(
          'filter__link',
          { selected: todosFilter === Filters.All },
        )}
        onClick={handleSelectedTodos}
      >
        All
      </a>

      <a
        href="#/active"
        data-cy="FilterLinkActive"
        className={cn(
          'filter__link',
          { selected: todosFilter === Filters.Active },
        )}
        onClick={handleSelectedTodos}
      >
        Active
      </a>

      <a
        href="#/completed"
        data-cy="FilterLinkCompleted"
        className={cn(
          'filter__link',
          { selected: todosFilter === Filters.Completed },
        )}
        onClick={handleSelectedTodos}
      >
        Completed
      </a>
    </nav>
  );
});
