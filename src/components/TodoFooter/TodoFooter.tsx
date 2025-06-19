import React from 'react';
import { FilterTypeValues } from '../../types/FilterType';
import { ClearCompletedButton } from '../ClearCompletedButton';
import { TodoFilter } from '../TodoFilter';

interface Props {
  filter: FilterTypeValues;
  setFilter: (filter: FilterTypeValues) => void;
  deleteCompletedTodos: () => void;
  hasCompletedTodos: boolean;
  countOfActiveTodos: number;
}

export const TodoFooter: React.FC<Props> = ({
  filter,
  setFilter,
  deleteCompletedTodos,
  hasCompletedTodos,
  countOfActiveTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countOfActiveTodos} items left
      </span>

      <TodoFilter setFilter={setFilter} filter={filter} />

      <ClearCompletedButton
        deleteCompletedTodos={deleteCompletedTodos}
        hasCompletedTodos={hasCompletedTodos}
      />
    </footer>
  );
};
