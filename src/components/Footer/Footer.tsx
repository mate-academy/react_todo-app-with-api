import React from 'react';
import { Filter } from '../Filter';
import { Todo } from '../../types/Todo';
import { FilteringOption } from '../../types/Filter';

interface Props {
  todos: Todo[];
  filter: FilteringOption;
  setFilter: (filter: FilteringOption) => void;
  activeTodos: Todo[];
  completedTodos: Todo[];
  handleClearCompletedTodos: () => Promise<void>;
}

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  activeTodos,
  completedTodos,
  handleClearCompletedTodos,
}) => {
  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer">
          <span className="todo-count">
            {`${activeTodos.length} items left`}
          </span>

          <Filter filter={filter} setFilter={setFilter} />

          {completedTodos.length > 0 && (
            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={handleClearCompletedTodos}
            >
              Clear completed
            </button>
          )}
        </footer>
      )}
    </>
  );
};
