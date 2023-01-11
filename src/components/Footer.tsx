import classNames from 'classnames';
import React, { useContext, useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';
import { AuthContext } from './Auth/AuthContext';
import { ErrorContext } from './ErrorContext';

type Props = {
  todos: Todo[],
  visibleTodos: Todo[],
  setVisibleTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setIsCompletedTodosDeleting: React.Dispatch<React.SetStateAction<boolean>>,
};

enum FilterType {
  All = 'all',
  Completed = 'completed',
  Active = 'active',
}

export const Footer = ({
  todos,
  setVisibleTodos,
  visibleTodos,
  setIsCompletedTodosDeleting,
}: Props) => {
  const [filterType, setFilterType] = useState(FilterType.All);
  const completedTodos = visibleTodos.filter(todo => todo.completed);
  const itemsLeft = todos.filter(todo => !todo.completed).length;
  const user = useContext(AuthContext);
  const {
    setIsRemoveErrorShown,
    setIsEmptyTitleErrorShown,
    setIsTogglingErrorShown,
    setHasLoadingError,
    setIsAddingErrorShown,
  } = useContext(ErrorContext);

  function setErrorsToFalseExceptRemoveError() {
    setIsEmptyTitleErrorShown(false);
    setHasLoadingError(false);
    setIsTogglingErrorShown(false);
    setIsAddingErrorShown(false);

    setIsRemoveErrorShown(true);
  }

  const completedTodosLength = todos.filter(x => x.completed).length;
  const activeTodosLength = todos.filter(x => !x.completed).length;

  useEffect(() => {
    switch (filterType) {
      case FilterType.All:
        setVisibleTodos(todos);

        break;

      case FilterType.Completed:
        setVisibleTodos(todos.filter((todo) => todo.completed));
        break;

      case FilterType.Active:
        setVisibleTodos(todos.filter((todo) => !todo.completed));
        break;

      default:
        throw new Error('Wrong Type');
    }
  }, [filterType, todos.length, completedTodosLength, activeTodosLength]);

  const clearCompletedHandler = () => {
    setIsCompletedTodosDeleting(true);
    if (!user) {
      return;
    }

    const promiseArray = completedTodos.map(completedTodo => {
      return deleteTodo(user.id, completedTodo.id);
    });

    Promise.all(promiseArray).then(() => {
      setVisibleTodos(prev => prev.filter(x => !x.completed));

      setIsCompletedTodosDeleting(false);
      setIsRemoveErrorShown(false);
    })
      .catch(() => {
        setFilterType(prev => prev);
        setErrorsToFalseExceptRemoveError();
        setIsCompletedTodosDeleting(false);
      });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${itemsLeft} `}
        items left
      </span>

      <nav className="filter" data-cy="Filter">
        <button
          type="button"
          data-cy="FilterLinkAll"
          className={classNames('filter__link', {
            selected: filterType === FilterType.All,
          })}
          onClick={() => setFilterType(FilterType.All)}
        >
          All
        </button>

        <button
          type="button"
          data-cy="FilterLinkActive"
          className={classNames('filter__link', {
            selected: filterType === FilterType.Active,
          })}
          onClick={() => setFilterType(FilterType.Active)}
        >
          Active
        </button>
        <button
          type="button"
          data-cy="FilterLinkCompleted"
          className={classNames('filter__link', {
            selected: filterType === FilterType.Completed,
          })}
          onClick={() => setFilterType(FilterType.Completed)}
        >
          Completed
        </button>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          { hidden: completedTodos.length === 0 },
        )}
        onClick={clearCompletedHandler}
      >
        Clear completed
      </button>
    </footer>
  );
};
