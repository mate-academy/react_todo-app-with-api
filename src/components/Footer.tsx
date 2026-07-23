import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { FilterStatus } from '../types/FilterStatus';

type Props = {
  todos: Todo[];
  filter: FilterStatus;
  setFilter: (filter: FilterStatus) => void;
  onDelete: (todoId: number) => Promise<void>;
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  onDelete,
}) => {
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    // Видаляємо всі виконані туду паралельно
    const deletePromises = completedTodos.map(todo => onDelete(todo.id));

    await Promise.allSettled(deletePromises);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      {/* Лічильник активних задач */}
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeCount} ${activeCount === 1 ? 'item' : 'items'} left`}
      </span>

      {/* Фільтри status */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          data-cy="FilterLinkAll"
          className={classNames('filter__link', {
            selected: filter === FilterStatus.All,
          })}
          onClick={() => setFilter(FilterStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          data-cy="FilterLinkActive"
          className={classNames('filter__link', {
            selected: filter === FilterStatus.Active,
          })}
          onClick={() => setFilter(FilterStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          data-cy="FilterLinkCompleted"
          className={classNames('filter__link', {
            selected: filter === FilterStatus.Completed,
          })}
          onClick={() => setFilter(FilterStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* Кнопка Clear completed */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedCount === 0}
        style={{ visibility: completedCount > 0 ? 'visible' : 'hidden' }}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
