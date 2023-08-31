import React from 'react';
import cn from 'classnames';
import { FilterOptions } from '../../types/FilterOptions';

type Props = {
  filterOption: FilterOptions;
  onSetFilterOption: React.Dispatch<React.SetStateAction<FilterOptions>>;
  activeTodosCount: number;
  completedTodoIds: number[];
  onDeleteTodo: (id: number) => void;
};

export const TodoFooter: React.FC<Props> = React.memo(({
  filterOption,
  onSetFilterOption,
  activeTodosCount,
  completedTodoIds,
  onDeleteTodo,
}) => {
  const handleDeleteCompleted = () => {
    completedTodoIds.forEach(todoId => {
      onDeleteTodo(todoId);
    });
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn(
            'filter__link',
            { selected: filterOption === FilterOptions.All },
          )}
          onClick={() => onSetFilterOption(FilterOptions.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn(
            'filter__link',
            { selected: filterOption === FilterOptions.Active },
          )}
          onClick={() => onSetFilterOption(FilterOptions.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn(
            'filter__link',
            { selected: filterOption === FilterOptions.Completed },
          )}
          onClick={() => onSetFilterOption(FilterOptions.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        style={{ visibility: !completedTodoIds.length ? 'hidden' : 'visible' }}
        onClick={handleDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
});
