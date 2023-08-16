/* eslint-disable */
import React from "react"
import { Todo } from "../types/Todo";
import classNames from "classnames";
import { FilterTypes } from "../types/FilterTypes";

type Props = {
  todos: Todo[];
  filterType: FilterTypes;
  setFilterType: React.Dispatch<React.SetStateAction<FilterTypes>>;
  handlerDeleteCompletedTodos: () => Promise<void>;
}

export const Footer: React.FC<Props> = ({
  todos,
  filterType,
  setFilterType,
  handlerDeleteCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {todos.length}
        {' items left'}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link',
            { selected: filterType === FilterTypes.All })}
          onClick={() => setFilterType(FilterTypes.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link',
            { selected: filterType === FilterTypes.Active })}
          onClick={() => setFilterType(FilterTypes.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link',
            { selected: filterType === FilterTypes.Complited })}
          onClick={() => setFilterType(FilterTypes.Complited)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed',
          { 'is-invisible': !todos.some(todo => todo.completed === true) })}
        onClick={handlerDeleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
}
