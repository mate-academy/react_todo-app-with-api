/* eslint-disable react/display-name */
import { FilterOptions } from '../types/FilterOptions';
import { Todo } from '../types/Todo';
import { Filter } from '../components';
import { memo, useMemo } from 'react';

interface Props {
  currentTodoList: Todo[];
  activeFilter: FilterOptions;
  handleFilterChange: (newFilter: FilterOptions) => void;
  handleClearCompletedTodos: () => void;
}

export const Footer = memo(
  ({
    currentTodoList,
    activeFilter,
    handleFilterChange,
    handleClearCompletedTodos,
  }: Props) => {
    const areAllTodosDone = currentTodoList.every(
      (todo: Todo) => !todo.completed,
    );
    const activeTodos = useMemo(
      () => currentTodoList.filter(todo => !todo.completed),
      [currentTodoList],
    );

    return (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {activeTodos.length} items left
        </span>

        <Filter
          activeFilter={activeFilter}
          handleFilterChange={(string: FilterOptions) =>
            handleFilterChange(string)
          }
        />

        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled={areAllTodosDone}
          onClick={handleClearCompletedTodos}
        >
          Clear completed
        </button>
      </footer>
    );
  },
);
