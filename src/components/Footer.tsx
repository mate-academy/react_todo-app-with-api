import React from 'react';
import { Filter } from '../types/Filter';
import { TodoFilter } from './TodoFilter';
import { Todo } from '../types/Todo';

type Props = {
  filterBy: string;
  changeFilter: (filter: Filter) => void,
  completedTodos: Todo[],
  uncompletedTodos: Todo[],
  clearCompleted: () => void,
};

export const Footer: React.FC<Props> = React.memo(({
  filterBy,
  changeFilter,
  completedTodos,
  uncompletedTodos,
  clearCompleted,

}) => {
  const isCompletedButtonDisabaled = !completedTodos.length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${uncompletedTodos.length} items left`}
      </span>

      <TodoFilter
        filterBy={filterBy}
        changeFilter={changeFilter}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={isCompletedButtonDisabaled}
      >
        Clear completed
      </button>
    </footer>
  );
});
