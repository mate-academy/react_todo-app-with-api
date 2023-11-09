import React, { useCallback, useContext, useMemo } from 'react';
import classNames from 'classnames';

import { DispatchContext, StateContext } from '../states/Global';
import { FilterBy } from '../types/FilterBy';
import { deleteTodo } from '../api/todos';
import { ActionType } from '../states/Reducer';

interface Props {
  selectedFilter: FilterBy,
  onFilterSelected: (value: FilterBy) => void,
}

export const TodoFooter: React.FC<Props> = React.memo(({
  selectedFilter,
  onFilterSelected,
}) => {
  const { todos } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const completedTodos = useMemo(
    () => todos.filter((todo) => todo.completed),
    [todos],
  );

  const getActiveCount = useCallback(() => {
    return todos.reduce((acc, todo) => {
      return !todo.completed ? acc + 1 : acc;
    }, 0);
  }, [todos]);

  const getFilters = useCallback(() => {
    const allFilters = Object.values(FilterBy);
    const filtersNames = allFilters.slice(0, 3);
    const filtersValues = allFilters.slice(3);

    return filtersNames.reduce((acc, item, i) => {
      return {
        ...acc,
        [item]: filtersValues[i],
      };
    }, {});
  }, []);

  const deleteCompleted = () => {
    const requests = completedTodos.map((todo) => {
      dispatch({
        type: ActionType.SetTodoToProcess,
        payload: { todo },
      });

      return deleteTodo(dispatch, todo.id);
    });

    Promise.allSettled(requests)
      .finally(() => {
        dispatch({
          type: ActionType.SetTodoToProcess,
          payload: { todo: null },
        });
      });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${getActiveCount()} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.entries(getFilters())
          .map(([name, value]) => (
            <a
              key={name}
              href="#/"
              className={classNames('filter__link', {
                selected: selectedFilter === value,
              })}
              data-cy="FilterLinkAll"
              onClick={() => onFilterSelected(value as FilterBy)}
            >
              {name}
            </a>
          ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={deleteCompleted}
        disabled={!completedTodos.length}
      >
        Clear completed
      </button>
    </footer>
  );
});
