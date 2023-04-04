import React, { Dispatch, SetStateAction } from 'react';
import { Todo } from '../../types/Todo';
import { FilterOptions } from '../../types/FilterOptions';
import { FilterButton } from '../FilterButton';

const filterTitles = Object.keys(FilterOptions);

type Props = {
  todos: Todo[],
  currentFilter: string,
  onSelectFilter: Dispatch<SetStateAction<FilterOptions>>,
  deleteTodo: (id: number) => void,
};

export const Footer: React.FC<Props> = ({
  todos,
  currentFilter,
  onSelectFilter,
  deleteTodo,
}) => {
  const completedTodos = todos.filter(({ completed }) => completed);
  const activeTodos = todos.filter(({ completed }) => !completed);
  const clearCompleted = () => completedTodos
    .forEach(({ id }) => deleteTodo(id));

  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer">
          <span className="todo-count">
            {`${activeTodos.length} items left`}
          </span>

          <nav className="filter">
            {filterTitles.map(title => (
              <FilterButton
                key={title}
                filter={title}
                onClick={onSelectFilter}
                currentFilter={currentFilter}
              />
            ))}
          </nav>

          {completedTodos.length > 0 && (
            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={clearCompleted}
            >
              Clear completed
            </button>
          )}
        </footer>
      )}
    </>
  );
};
