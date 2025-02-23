import React from 'react';
import cn from 'classnames';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  filterValue: Filter;
  onClickFilter: (filterValue: Filter) => void;
  deleteTodo: (todoId: number) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterValue,
  onClickFilter,
  deleteTodo,
}) => {
  const isCompleted = todos.some(todo => todo.completed);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const handleDeleteCompleteTodos = () => {
    const allCompletedTodos = todos.filter(todo => todo.completed);

    allCompletedTodos.forEach(todo => deleteTodo(todo.id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(value => (
          <a
            key={value}
            href="#/"
            className={cn('filter__link', { selected: filterValue === value })}
            data-cy={`FilterLink${value}`}
            onClick={() => onClickFilter(value)}
          >
            {value}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isCompleted}
        onClick={handleDeleteCompleteTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
