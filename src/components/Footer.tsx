import React from 'react';
import { FilterComponent } from './Filter';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';

type Props = {
  todos: Todo[],
  filterType: FilterType;
  filterChange: (filter: FilterType) => void;
  deleteCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterType,
  filterChange,
  deleteCompleted,
}) => {
  const incompleteTodosCount = todos.filter(todo => !todo.completed).length;
  const someCompleted = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${incompleteTodosCount} ${incompleteTodosCount < 2 ? 'item' : 'items'} left`}
      </span>

      <FilterComponent filterChange={filterChange} filterType={filterType} />

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!someCompleted}
        onClick={deleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
