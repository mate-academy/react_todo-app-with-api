import { getFilteredTodos } from '../../utils/getFilteredTodos';
import { FilterTodos } from './FilterTodos';
import { Todo, TodoStatus } from '../../types/Todo';

type FooterProps = {
  todos: Todo[];
  status: TodoStatus;
  setStatus: (value: TodoStatus) => void;
  handleClearCompleted: () => void;
};

export const Footer = ({
  todos,
  status,
  setStatus,
  handleClearCompleted,
}: FooterProps) => {
  const activeTodos = getFilteredTodos({
    todos,
    status: 'active',
  });

  const hasCompletedTodos = todos.filter(todo => todo.completed).length > 0;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <FilterTodos status={status} setStatus={setStatus} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
