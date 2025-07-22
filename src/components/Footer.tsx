import cn from 'classnames';
import React from 'react';
import { Todo } from './../types/Todo';
import { FilterType } from '../types/FilterType';

type Props = {
  todos: Todo[];
  todosFilter: string;
  setTodosFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  deleteCompletedTodos: () => void;
  setDeletingIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export const Footer: React.FC<Props> = ({
  todos,
  todosFilter,
  setTodosFilter,
  deleteCompletedTodos,
  setDeletingIds,
}) => {
  const handleClearCompleted = () => {
    deleteCompletedTodos();
    setDeletingIds(todos.filter(todo => todo.completed).map(todo => todo.id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map(value => (
          <a
            href={`#/${value}`}
            className={cn('filter__link', {
              selected: todosFilter === value,
            })}
            data-cy={`FilterLink${value[0].toUpperCase() + value.slice(1)}`}
            onClick={() => setTodosFilter(value)}
            key={value}
          >
            {value[0].toUpperCase() + value.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => handleClearCompleted()}
        disabled={todos.filter(todo => todo.completed).length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
