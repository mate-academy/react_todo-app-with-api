import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (todoId: number) => void;
  loadingTodos: number[];
  onCompleteTodo: (todoId: number) => Promise<void>
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  loadingTodos,
  onCompleteTodo,
}) => {
  const handleRemoveButton = () => {
    deleteTodo(todo.id);
  };

  const handleCheckboxChange = () => {
    onCompleteTodo(todo.id);
  };

  return (
    <div className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleCheckboxChange}
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={handleRemoveButton}
      >
        ×
      </button>

      <div className={cn('modal overlay', {
        'is-active': loadingTodos.includes(todo.id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
