import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  activeTodosCounter: number;
  completedTodosCounter: number;
  onFilterFieldChange: (filter: FilterType) => void;
  filterField: FilterType;
  handleDeleteTodo: (todoId: number) => Promise<void>;
  onErrorMessageChange: (error: string) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  activeTodosCounter,
  completedTodosCounter,
  onFilterFieldChange,
  filterField,
  handleDeleteTodo,
  onErrorMessageChange,
}) => {
  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const deletePromises = completedTodos.map(todo => {
      return handleDeleteTodo(todo.id);
    });

    Promise.all(deletePromises)
      .catch((error) => {
        onErrorMessageChange('Unable to clear all completed todos');
        throw error;
      });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCounter} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterField === FilterType.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onFilterFieldChange(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterField === FilterType.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onFilterFieldChange(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterField === FilterType.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilterFieldChange(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodosCounter}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
