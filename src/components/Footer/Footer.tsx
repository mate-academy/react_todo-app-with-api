import { FC } from 'react';
import { TodoFilter } from '../TodoFilter';
import { Todo } from '../../types/Todo';
import { FilterTodosBy } from '../../types/FilterTodosBy';

type Props = {
  todos: Todo[],
  filterBy: string,
  setFilterBy: (filterTodosBy: FilterTodosBy) => void,
};

export const Footer:FC<Props> = ({
  todos,
  filterBy,
  setFilterBy,
}) => {
  const hasCompletedTodos = () => {
    return todos.some(todo => todo.completed === true);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todos.length} items left`}
      </span>

      <TodoFilter
        setFilterBy={setFilterBy}
        filterBy={filterBy}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        style={{
          opacity: Number(hasCompletedTodos()),
          cursor: hasCompletedTodos() ? 'pointer' : 'default',
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
