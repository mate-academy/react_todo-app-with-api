import React from 'react';

import { Todo } from '../types/Todo';
import { TodoFilter } from './TodoFilter';
import { Status } from '../types/Status';

type Props = {
  todos: Todo[],
  completedTodosCount: number,
  status: Status,
  handleClearCompletedTodos: () => void,
  handleFilterStatus: (status: Status) => void,
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  completedTodosCount: CompletedTodosCount,
  status,
  handleClearCompletedTodos,
  handleFilterStatus,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.length - CompletedTodosCount === 1
          ? '1 item left'
          : `${todos.length - CompletedTodosCount} items left`}
      </span>

      <TodoFilter
        handleFilterStatus={handleFilterStatus}
        todosFilterStatus={status}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={!CompletedTodosCount}
        data-cy="ClearCompletedButton"
        onClick={handleClearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
