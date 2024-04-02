import { useTodos } from '../../context/TodosContext';
import { TodoFilter } from '../TodoFilter';

export const Footer: React.FC = () => {
  const { todos, handleDeletingTodo } = useTodos();

  const unCompletedTodos = todos.filter(todo => !todo.completed).length;
  const isCompletedTodo = todos.some(todo => todo.completed);

  const handleDeletingAllTodo = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeletingTodo(todo.id);
      }
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {unCompletedTodos} items left
      </span>

      <TodoFilter />

      <button
        disabled={!isCompletedTodo}
        onClick={handleDeletingAllTodo}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
