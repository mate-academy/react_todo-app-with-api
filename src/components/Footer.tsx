import { TodoFilter } from './TodoFilter';
import { Todo } from '../types/Todo';

type Props = {
  setFilterValue: (filterValue: string) => void;
  filterValue: string;
  todos: Todo[];
  clearCompletedTodos: () => void;
  completedTodos: Todo[];
};

export const Footer: React.FC <Props>
= ({
  setFilterValue, filterValue, todos, clearCompletedTodos, completedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {todos.length}
        {' '}
        items left
      </span>

      <TodoFilter setFilterValue={setFilterValue} filterValue={filterValue} />
      {completedTodos.length !== 0
        ? (
          <button
            type="button"
            className="todoapp__clear-completed"
            onClick={clearCompletedTodos}
          >
            Clear completed
          </button>
        ) : null}
    </footer>
  );
};
