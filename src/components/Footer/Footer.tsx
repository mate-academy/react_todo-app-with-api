import React, { useMemo } from 'react';
import { FilterTodo } from '../../types/FilterTodo';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  changeVisibleTodos: (el: FilterTodo) => void;
  todos: Todo[];
  filtered: FilterTodo;
  onDelete: (id: number[]) => Promise<void>;
};

export const Footer: React.FC<Props> = ({
  changeVisibleTodos,
  filtered,
  onDelete,
  todos,
}) => {
  const uncompletedTodos = useMemo(() => {
    return todos.filter(td => !td.completed).length;
  }, [todos]);

  const completedTodos = useMemo(() => {
    return todos.filter(td => td.completed).length;
  }, [todos]);

  const deleteCompleted = () => {
    const deleted = todos.filter(td => td.completed).map(todo => todo.id);

    if (deleted.length > 0) {
      onDelete(deleted);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {uncompletedTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterTodo).map(title => (
          <a
            key={title}
            href="#/"
            className={classNames('filter__link', {
              selected: filtered === title,
            })}
            data-cy={`FilterLink${title}`}
            onClick={() => changeVisibleTodos(title as FilterTodo)}
          >
            {title}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={deleteCompleted}
        disabled={completedTodos === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
