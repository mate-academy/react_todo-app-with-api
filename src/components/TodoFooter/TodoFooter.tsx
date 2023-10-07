import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoFilter } from '../TodoFilter';
import { StatusState } from '../../types/StatusState';

type Props = {
  todos: Todo[],
  CompletedTodosCount: number,
  statusTodo: StatusState,
  handleClearComletedTodo: () => void,
  handleChangeFilter: (status: StatusState) => void,
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  CompletedTodosCount,
  statusTodo,
  handleClearComletedTodo,
  handleChangeFilter,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.length - CompletedTodosCount === 1
          ? '1 items left'
          : `${todos.length - CompletedTodosCount} items left`}
      </span>
      <TodoFilter
        filterTodo={statusTodo}
        onChangeFilter={handleChangeFilter}
      />
      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={!CompletedTodosCount}
        data-cy="ClearCompletedButton"
        onClick={handleClearComletedTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};
