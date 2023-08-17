import React from 'react';
import cn from 'classnames';
import { Filter } from './Filter';
import { Todo } from './types/Todo';
import { Filters } from './types/Filters';

interface Props {
  filter: Filters;
  setFilter: (filter: Filters) => void;
  handleClearCompleted: () => void;
  completedTodos: Todo[];
  visibletodos: Todo[];
  errorText: string;
  setErrorText: (error: string) => void;
}

export const TodoFooter: React.FC<Props> = ({
  filter,
  setFilter,
  handleClearCompleted,
  completedTodos,
  visibletodos,
  errorText,
  setErrorText,
}) => {
  return (
    <>
      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${visibletodos.length} items left`}
        </span>

        <Filter filter={filter} setFilter={setFilter} />

        {completedTodos.length > 0 && (
          <div>
            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </div>
        )}
      </footer>
      <div className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorText },
      )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setErrorText('')}
          aria-label="Dismiss error"
        />
        {errorText}
      </div>
    </>
  );
};
