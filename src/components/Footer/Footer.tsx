import React from 'react';
import { FilterType } from '../../types/Filtertype';
import { Todo } from '../../types/Todo';
import { Filter } from '../Filter/Filter';

type Props = {
  todoItemLeft: number;
  filterType: FilterType;
  setFilterType: (type: FilterType) => void;
  clearCompleted: () => void;
  complitedTodos: Todo[];
};

export const Footer: React.FC<Props> = ({
  todoItemLeft,
  filterType,
  setFilterType,
  clearCompleted,
  complitedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todoItemLeft} items left`}
      </span>

      <Filter
        filterType={filterType}
        setFilterType={setFilterType}
      />

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={clearCompleted}
        disabled={complitedTodos.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
