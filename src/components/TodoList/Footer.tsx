import React from 'react';
import { FilterProps } from '../../types/Filter';
import { TodoFilter } from './TodoFilter';

export const Footer: React.FC<FilterProps> = ({
  todosQty,
  filterTodo,
  selectedTodoFilter,
  handleClearCompleted,
  hasCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosQty} items left`}
      </span>

      <TodoFilter
        filterTodo={filterTodo}
        selectedTodoFilter={selectedTodoFilter}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
