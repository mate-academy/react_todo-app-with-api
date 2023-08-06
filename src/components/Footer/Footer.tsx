import { FC } from 'react';
import { FilterBy } from '../../types/TodosFilter';
import { TodoFilter } from '../TodoFilter';

interface Props {
  activeTodosLength: number;
  filter: FilterBy;
  setFilter: (filter: FilterBy) => void;
  handleDeleteCompletedTodos: () => void;
}

export const Footer: FC<Props> = ({
  activeTodosLength,
  filter,
  setFilter,
  handleDeleteCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosLength} items left`}
      </span>

      <TodoFilter
        filter={filter}
        onSetFilter={setFilter}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={handleDeleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
