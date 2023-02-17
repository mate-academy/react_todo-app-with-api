import cn from 'classnames';
import React from 'react';
import { FilterBy } from '../../types/Filter';

type Props = {
  todoCount: number,
  filter: string,
  filterTodos: (filter: FilterBy) => void,
  removeCompletedTodos: () => void,
  renderClearCompleted: boolean,
  completedTodoIds: number[],
  processingTodoIds: number[],
  setProcessingTodoIds: (n: number[]) => void,
};

export const TodoFilter: React.FC<Props> = ({
  todoCount,
  filter,
  filterTodos,
  removeCompletedTodos,
  renderClearCompleted,
  completedTodoIds,
  processingTodoIds,
  setProcessingTodoIds,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todoCount} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn(
            'filter__link',
            { selected: filter === FilterBy.all },
          )}
          onClick={() => filterTodos(FilterBy.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn(
            'filter__link',
            { selected: filter === FilterBy.active },
          )}
          onClick={() => filterTodos(FilterBy.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn(
            'filter__link',
            { selected: filter === FilterBy.completed },
          )}
          onClick={() => filterTodos(FilterBy.completed)}
        >
          Completed
        </a>
      </nav>

      {renderClearCompleted && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => {
            setProcessingTodoIds([...processingTodoIds, ...completedTodoIds]);
            removeCompletedTodos();
          }}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
