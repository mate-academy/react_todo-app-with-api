import React from 'react';
import { TodoFilter } from './TodoFilter';
import { TodoFooterProps } from './types/TodoFooterProps';

export const TodoFooter: React.FC<TodoFooterProps> = ({
  todos,
  filterBy,
  handleFilterClick,
  clearCompletedTodos,
}) => {
  const isAnyTodoCompleted = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.filter(todo => !todo.completed).length} items left`}
      </span>

      <TodoFilter
        filterBy={filterBy}
        handleFilterClick={handleFilterClick}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompletedTodos}
        disabled={!isAnyTodoCompleted}
      >
        Clear completed
      </button>

    </footer>
  );
};
