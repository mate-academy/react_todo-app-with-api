import { Filter } from './Filter';
import { useTodos } from '../contexts/TodoContext';

export const Footer: React.FC = () => {
  const { todos, removeTodo, selectAllUncompleted } = useTodos();
  const isCompletedTodos = todos.some(todo => todo.completed);

  const todosLeft = selectAllUncompleted.length;
  const isSingleItemLeft = todosLeft === 1;

  const clearCompletedTodos = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => {
        removeTodo(todo.id);
      });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosLeft} item${isSingleItemLeft ? '' : 's'} left`}
      </span>

      <Filter />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isCompletedTodos}
        onClick={clearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
