import { useContext } from 'react';
import { DispatchContext, StateContext } from '../../store/Store';
import classNames from 'classnames';
import { FilterBy } from '../../enums/FilterBy';
import { Action } from '../../types/Action';

export const Filter = () => {
  const { sortBy } = useContext(StateContext);

  const dispatch = useContext(DispatchContext);

  const handleAction = (action: Action) => {
    dispatch(action);
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        onClick={() => handleAction({ type: 'SHOW_ALL' })}
        className={classNames('filter__link', {
          selected: sortBy === FilterBy.All,
        })}
        data-cy="FilterLinkAll"
      >
        All
      </a>

      <a
        href="#/active"
        onClick={() => handleAction({ type: 'SHOW_ACTIVE' })}
        className={classNames('filter__link', {
          selected: sortBy === FilterBy.Active,
        })}
        data-cy="FilterLinkActive"
      >
        Active
      </a>

      <a
        href="#/completed"
        onClick={() => handleAction({ type: 'SHOW_COMPLETED' })}
        className={classNames('filter__link', {
          selected: sortBy === FilterBy.Completed,
        })}
        data-cy="FilterLinkCompleted"
      >
        Completed
      </a>
    </nav>
  );
};
