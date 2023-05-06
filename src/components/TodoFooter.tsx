import React, { Dispatch, SetStateAction } from 'react';
import { TodoFilter } from './TodoFilter/TodoFilter';
import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  currentFilter: FilterType;
  setCurrentFilter: Dispatch<SetStateAction<FilterType>>;
  completedTodos: Todo[];
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  currentFilter,
  setCurrentFilter,
  completedTodos,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {`${todos.length} items left`}
    </span>

    <TodoFilter
      onChangeFilter={setCurrentFilter}
      currentFilter={currentFilter}
    />

    <button
      type="button"
      className="todoapp__clear-completed"
      style={{
        opacity: completedTodos.length > 0 ? 1 : 0,
      }}
    >
      Clear completed
    </button>
  </footer>
);
