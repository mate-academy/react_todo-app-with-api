import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { FilterValue } from '../types/FilterValue';
import { ErrorType } from '../types/ErrorType';

type Props = {
  todos: Todo[];
  filterChange: (filter: FilterValue) => void;
  filterValue: FilterValue;
  clearCompleted: () => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<ErrorType | null>>;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  filterChange,
  filterValue,
  clearCompleted,
  setTodos,
  setError,
}) => {
  const completedTodos = todos.filter((todo) => todo.completed);
  const activeTodos = todos.filter((todo) => !todo.completed);
  const [isClearingCompleted, setIsClearingCompleted] = useState(false);

  const handleClearCompleted = async () => {
    try {
      setIsClearingCompleted(true);
      await clearCompleted();
      setTodos((currentTodos: Todo[]) => currentTodos
        .filter((todo) => !todo.completed));
    } catch (error) {
      setError(ErrorType.DeleteTodoError);
    } finally {
      setIsClearingCompleted(false);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterValue === FilterValue.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => filterChange(FilterValue.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterValue === FilterValue.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => filterChange(FilterValue.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterValue === FilterValue.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => filterChange(FilterValue.Completed)}
        >
          Completed
        </a>
      </nav>

      {completedTodos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__clear-completed', {
            'clearing-completed': isClearingCompleted,
          })}
          data-cy="ClearCompletedButton"
          onClick={handleClearCompleted}
        >
          {isClearingCompleted ? 'Clearing...' : 'Clear completed'}
        </button>
      )}
    </footer>
  );
};
