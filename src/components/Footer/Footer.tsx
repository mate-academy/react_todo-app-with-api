import React, { useMemo } from 'react';
import { FilterTypes, TodoFilter } from '../TodoFilter';
import { Todo } from '../../types/Todo';

import './Footer.scss';

type Props = {
  todos: Todo[]
  onFilterType: (type: FilterTypes) => void
  onRemoveTodos: () => void
  filter: FilterTypes
};

export const Footer: React.FC<Props> = ({
  todos,
  onFilterType,
  onRemoveTodos,
  filter,
}) => {
  const leftTodos = useMemo(() => todos.filter(
    todo => !todo.completed,
  ), [todos]);
  const doneTodos = useMemo(() => todos.filter(
    todo => todo.completed,
  ), [todos]);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${leftTodos.length} ${leftTodos.length > 1 ? 'items' : 'item'} left`}
      </span>

      <TodoFilter
        onFilterType={onFilterType}
        filter={filter}
      />

      {
        doneTodos.length !== 0
        && (
          <button
            type="button"
            className="todoapp__clear-completed"
            onClick={onRemoveTodos}
          >
            Clear completed
          </button>
        )
      }
    </footer>
  );
};
