import React, { useContext, useState } from 'react';
import { TodosContext } from './TodosContext';
import classNames from 'classnames';
import { FilterStatus } from '../types/FilterStatus';
import { TEMPORARY_TODO_ID, deleteTodo } from '../api/todos';
import { Errors } from '../types/Errors';
import { hideError } from '../functions/hideError';

export const Footer: React.FC = () => {
  const {
    todos,
    setTodos,
    activeCount,
    setFilter,
    setLoadingTodo,
    setMessageError,
  } = useContext(TodosContext);

  const [todosStatus, setTodosStatus] = useState(FilterStatus.All);

  const disabledClearCompletedButton =
    todos.filter(todo => todo.id !== TEMPORARY_TODO_ID).length - activeCount <=
    0;

  const handleVisible = (status: FilterStatus) => {
    switch (status) {
      case FilterStatus.Active:
        setFilter(FilterStatus.Active);
        setTodosStatus(FilterStatus.Active);
        break;

      case FilterStatus.Completed:
        setFilter(FilterStatus.Completed);
        setTodosStatus(FilterStatus.Completed);
        break;

      case FilterStatus.All:
        setFilter(FilterStatus.All);
        setTodosStatus(FilterStatus.All);
        break;

      default:
        setTodos(todos);
    }
  };

  const handleClearCompleted = () => {
    const justCompletedTodos = todos.filter(todo => todo.completed);
    const idsToDelete: number[] = [];
    const idsWithErrors: number[] = [];

    setLoadingTodo(idsToDelete);

    justCompletedTodos.forEach(todo => {
      idsToDelete.push(todo.id);
    });

    Promise.allSettled(idsToDelete.map(id => deleteTodo(id)))
      .then(results => {
        results.forEach((result, index) => {
          if (result.status !== 'fulfilled') {
            idsWithErrors.push(justCompletedTodos[index].id);
            setMessageError(Errors.CantDelete);
            hideError(setMessageError);
          }
        });
        setTodos(prevTodos =>
          prevTodos.filter(
            todo =>
              !idsToDelete.includes(todo.id) || idsWithErrors.includes(todo.id),
          ),
        );
      })
      .finally(() => {
        setLoadingTodo([]);
      });
  };

  return (
    todos.length > 0 && (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {`${activeCount} items left`}
        </span>

        <nav className="filter" data-cy="Filter">
          <a
            href="#/"
            className={classNames('filter__link', {
              selected: todosStatus === FilterStatus.All,
            })}
            data-cy="FilterLinkAll"
            onClick={() => handleVisible(FilterStatus.All)}
          >
            All
          </a>

          <a
            href="#/active"
            className={classNames('filter__link', {
              selected: todosStatus === FilterStatus.Active,
            })}
            data-cy="FilterLinkActive"
            onClick={() => handleVisible(FilterStatus.Active)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={classNames('filter__link', {
              selected: todosStatus === FilterStatus.Completed,
            })}
            data-cy="FilterLinkCompleted"
            onClick={() => handleVisible(FilterStatus.Completed)}
          >
            Completed
          </a>
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled={disabledClearCompletedButton}
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      </footer>
    )
  );
};
