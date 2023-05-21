import { useContext } from 'react';
import { Filter } from '../Filter';
import { TodosContext } from '../../contexts/TodosContext';

export const Footer: React.FC = () => {
  const { todos } = useContext(TodosContext);
  const { removeTodos } = useContext(TodosContext);

  const handleClose = () => {
    const todosForDeletingId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    removeTodos(todosForDeletingId);
  };

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const haveCompletedTodos = activeTodosCount !== todos.length;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount} items left`}
      </span>

      <Filter />

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={handleClose}
        hidden={!haveCompletedTodos}
      >
        Clear completed
      </button>

    </footer>
  );
};
