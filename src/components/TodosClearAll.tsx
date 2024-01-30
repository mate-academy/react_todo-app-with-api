import { useContext } from 'react';
import { TodosContext } from './TodosContext';

export const TodosClearAll: React.FC = () => {
  const { todos, active, doDelete } = useContext(TodosContext);
  const hasComplited = todos.length - active > 0;

  const handleClearCompleted = () => {
    todos.filter(todo => todo.completed)
      .forEach(todo => doDelete(todo.id.toString()));
  };

  return (
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      onClick={handleClearCompleted}
      disabled={!hasComplited}
    >
      Clear completed
    </button>
  );
};
