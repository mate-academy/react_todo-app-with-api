import { useContext } from 'react';
import { DispatchContext, StateContext } from './StateContext';
import { FilterType } from '../types/FilterType';
import classNames from 'classnames';
import { deleteTodo } from '../api/todos';

export const ToDoFooter = () => {
  const dispatch = useContext(DispatchContext);
  const { filter, todos } = useContext(StateContext);

  const activeTodosLength = todos.filter(todo => !todo.completed).length;

  const removeCompletedTodo = async () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    dispatch({
      type: 'LOADING_TODOS',
      id: completedIds,
    });

    // Try to delete each completed todo and collect results
    const results = await Promise.allSettled(
      todos.filter(todo => todo.completed).map(todo => deleteTodo(todo.id)),
    );

    // Keep todos that are either not completed or failed to delete
    const updatedTodos = todos.filter(todo => {
      if (!todo.completed) {
        return true;
      }

      // Find the index of this completed todo in the results array
      const completedIdx = completedIds.indexOf(todo.id);

      // If deletion failed, keep it
      return completedIdx !== -1 && results[completedIdx].status === 'rejected';
    });

    // Show error if any deletion failed
    if (results.some(r => r.status === 'rejected')) {
      dispatch({
        type: 'SHOW_ERROR',
        message: 'Unable to delete a todo',
      });
    }

    dispatch({
      type: 'GET_TODOS',
      todos: updatedTodos,
    });

    dispatch({
      type: 'LOADING_TODOS',
      id: [],
    });
  };

  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {`${activeTodosLength} items left`}
          </span>

          {/* Active link should have the 'selected' class */}
          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              onClick={() => {
                dispatch({
                  type: 'FILTER_TODOS',
                  filteredOptions: FilterType.ALL,
                });
              }}
              className={classNames('filter__link', {
                selected: filter === FilterType.ALL,
              })}
              data-cy="FilterLinkAll"
            >
              All
            </a>

            <a
              href="#/active"
              onClick={() => {
                dispatch({
                  type: 'FILTER_TODOS',
                  filteredOptions: FilterType.ACTIVE,
                });
              }}
              className={classNames('filter__link', {
                selected: filter === FilterType.ACTIVE,
              })}
              data-cy="FilterLinkActive"
            >
              Active
            </a>

            <a
              href="#/completed"
              className={classNames('filter__link', {
                selected: filter === FilterType.COMPLETED,
              })}
              data-cy="FilterLinkCompleted"
              onClick={() => {
                dispatch({
                  type: 'FILTER_TODOS',
                  filteredOptions: FilterType.COMPLETED,
                });
              }}
            >
              Completed
            </a>
          </nav>

          {/* this button should be disabled if there are no completed todos */}
          <button
            type="button"
            className="todoapp__clear-completed"
            disabled={todos.length === activeTodosLength}
            data-cy="ClearCompletedButton"
            onClick={() => removeCompletedTodo()}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
