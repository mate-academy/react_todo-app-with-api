import { TodoFilter } from './TodoFilter';
import { Todo } from '../types/Todo';
import { FilterValue } from '../utils/FilterValue';

type Props = {
  filterValue: FilterValue;
  setFilterValue: (filterValue: FilterValue) => void;
  todos: Todo[];
  clearCompletedTodos: () => void;
  completedTodos: Todo[];
};

export const Footer: React.FC <Props>
= ({
  setFilterValue, filterValue, todos, clearCompletedTodos, completedTodos,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {activeTodos.length}
        {' '}
        items left
      </span>

      <TodoFilter setFilterValue={setFilterValue} filterValue={filterValue} />
      {completedTodos.length !== 0
        && (
          <button
            type="button"
            className="todoapp__clear-completed"
            onClick={clearCompletedTodos}
          >
            Clear completed
          </button>
        )}
    </footer>
  );
};
