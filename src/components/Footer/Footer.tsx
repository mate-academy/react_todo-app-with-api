import React from 'react';

import { Todo, FilterType } from '../../types';

import { FilterLink } from '../FilterLink';

interface Props {
  todos: Todo[];
  filterType: FilterType;
  onChangeType: (type: FilterType) => void;
  onDelete: (todoId: number) => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  filterType,
  onChangeType,
  onDelete,
}) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.some(todo => todo.completed);

  function handleDeleteAllCompleted() {
    const allCompletedTodos = todos.filter(todo => todo.completed);

    allCompletedTodos.map(todo => onDelete(todo.id));
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map(type => (
          <FilterLink
            key={type}
            type={type}
            filterType={filterType}
            onChangeType={onChangeType}
          />
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleDeleteAllCompleted}
        disabled={!completedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
