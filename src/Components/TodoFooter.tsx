import React, { useMemo } from 'react';
import classNames from 'classnames';
import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  filterType: FilterType;
  changeFilterType: (value: FilterType) => void;
  onDeleteTodo:(value:number) => Promise<void>;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  filterType,
  changeFilterType,
  onDeleteTodo,
}) => {
  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);
  const activeTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  const deleteCompletedTodos = () => {
    completedTodos.forEach(todo => onDeleteTodo(todo.id));
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterType === FilterType.All,
          })}
          onClick={() => changeFilterType(FilterType.All)}
        >
          {FilterType.All}
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterType === FilterType.Active,
          })}
          onClick={() => changeFilterType(FilterType.Active)}
        >
          {FilterType.Active}
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterType === FilterType.Completed,
          })}
          onClick={() => changeFilterType(FilterType.Completed)}
        >
          {FilterType.Completed}
        </a>
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed',
          { 'is-invisible': completedTodos.length === 0 })}
        onClick={deleteCompletedTodos}
      >
        Clear completed
      </button>

    </footer>
  );
};
