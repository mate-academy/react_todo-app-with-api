import React from 'react';
import { SelectedBy } from '../types/SelectedBy';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  selectedBy: SelectedBy;
  todos: Todo[];
  onSelect: (selectedBy: SelectedBy) => void;
  onClear: () => void;
};
export const Footer: React.FC<Props> = ({
  selectedBy,
  onSelect,
  todos,
  onClear,
}) => {
  const activeTodosLength = todos.reduce((sum: number, currTodo: Todo) => {
    return currTodo.completed ? sum : sum + 1;
  }, 0);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosLength} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(SelectedBy).map(value => (
          <a
            key={value}
            href={`#/${value}`}
            className={classNames('filter__link', {
              selected: selectedBy === value,
            })}
            onClick={() => onSelect(value)}
            data-cy={`FilterLink${value}`}
          >
            {value}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={activeTodosLength === todos.length}
        onClick={onClear}
      >
        Clear completed
      </button>
    </footer>
  );
};
