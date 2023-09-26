import React from 'react';
import { TodosFilter } from '../TodosFilter';

type Props = {
  activeTodosLength: number;
  hasCompletedTodo: boolean;
  onDeleteCompletedTodos: () => Promise<void>
};

export const Footer :React.FC<Props> = ({
  activeTodosLength,
  hasCompletedTodo,
  onDeleteCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosLength} ${activeTodosLength === 1 ? 'item' : 'items'} left`}
      </span>

      <TodosFilter />
      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        disabled={!hasCompletedTodo}
        onClick={() => onDeleteCompletedTodos()}
      >
        Clear completed
      </button>

    </footer>
  );
};
