import React from 'react';
import { FilterType } from '../../types/FilterType';
import { TodoFilter } from './TodoFilter';
import { Todo } from '../../types/Todo';

type FilterProps = {
  todos: Todo[],
  filterTodo: (value: FilterType) => void,
  selectedTodoFilter: FilterType,
  handleClearCompleted: () => void,
  hasCompletedTodos: boolean,
};

export const Footer: React.FC<FilterProps> = ({
  todos,
  filterTodo,
  selectedTodoFilter,
  handleClearCompleted,
  hasCompletedTodos,
}) => {
  const todosQty = todos.filter(todo => todo.completed !== true).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosQty} items left`}
      </span>
      {/* Hide the footer if there are no todos */}

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
