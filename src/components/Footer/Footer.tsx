import { useTodosProvider } from '../../providers/TodosContext';
import { FilterTodos } from './FilterTodos/FilterTodos';

export const Footer: React.FC = () => {
  const { handleClearCompleted, todos } = useTodosProvider();

  const countActiveTodos = todos.filter(todo => !todo.completed).length;
  const countCompletedTodos = todos.filter(todo => todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countActiveTodos} items left`}
      </span>

      <FilterTodos />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={countCompletedTodos === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
