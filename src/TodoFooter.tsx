import React from 'react';
import { FilterType } from './types/FilterType';
import { TodoFilter } from './TodoFilter';
import { Todo } from './types/Todo';

type Props = {
  filter: FilterType,
  setFilter: (filter: FilterType) => void,
  activeTodos: Todo[],
  completedTodos: Todo[],
  clearCompletedTodos: () => void,
};

export const TodoFooter: React.FC<Props> = ({
  filter, setFilter, activeTodos, completedTodos, clearCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      <TodoFilter filter={filter} setFilter={setFilter} />

      {completedTodos.length > 0 && (
        <button
          onClick={clearCompletedTodos}
          type="button"
          className="todoapp__clear-completed"
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
