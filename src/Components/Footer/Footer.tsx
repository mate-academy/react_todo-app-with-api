import React from 'react';
import cn from 'classnames';

import { FiltersType } from '../../types/filterTypes';
import { useApiErrorContext, useFormFocusContext, useTodosContext }
  from '../../hooks/getContextHooks';
import { deleteTodo } from '../../api/todos';
import {
  deleteTodoAction,
  setIsSpinningAction,
  removeIsSpinningAction,
} from '../../Context/actions/actionCreators';

import { getActiveTodos, getCompletedTodos }
  from '../../helpers/getFilteredTodos';

export const Footer: React.FC = () => {
  const { setIsFocused } = useFormFocusContext();
  const {
    todos,
    filter,
    setFilter,
    dispatch,
  } = useTodosContext();
  const { setApiError } = useApiErrorContext();

  const activeTodoNumber = getActiveTodos(todos).length;
  const completedTodos = getCompletedTodos(todos);
  const isClearCompletedInvisible = !completedTodos.length;

  const handleClearCompletedClick = () => {
    setIsFocused(false);

    const deletedTodos = completedTodos.map(({ id }) => {
      const isSpinningAction = setIsSpinningAction(id);

      dispatch(isSpinningAction);

      return deleteTodo(id)
        .then(() => {
          const deleteAction = deleteTodoAction(id);

          dispatch(deleteAction);
        })
        .catch((error) => {
          const removeAction = removeIsSpinningAction(id);

          dispatch(removeAction);
          setApiError(error);
        })
        .finally(() => {
          setIsFocused(true);
        });
    });

    return deletedTodos;
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodoNumber} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {(Object.entries(FiltersType))
          .map(([key, value]) => {
            const url = value.toLowerCase();

            return (
              <a
                data-cy={`FilterLink${value}`}
                href={`#/${url}`}
                key={key}
                className={cn('filter__link', {
                  selected: filter === value,
                })}
                onClick={() => setFilter(value)}
              >
                {value || 'All'}
              </a>
            );
          })}
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={cn('todoapp__clear-completed', {
          'is-invisible': isClearCompletedInvisible,
        })}
        onClick={handleClearCompletedClick}
        disabled={isClearCompletedInvisible}
      >
        Clear completed
      </button>

    </footer>
  );
};
