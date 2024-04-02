import React, { useContext } from 'react';
import { Filter } from '../../types/Filter';
import classNames from 'classnames';
import { DispatchContext, StateContext } from '../../Store';
import { onCompleteDelete } from '../../utils/requests';

type Props = {
  unCompletedTodos: number;
};

export const Footer: React.FC<Props> = ({ unCompletedTodos }) => {
  const { todos, filter } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const handleOnClick = (value: Filter) => {
    dispatch({ type: 'filter', payload: value });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${unCompletedTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => handleOnClick(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => handleOnClick(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleOnClick(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.length === unCompletedTodos}
        onClick={onCompleteDelete(todos, dispatch)}
      >
        Clear completed
      </button>
    </footer>
  );
};
