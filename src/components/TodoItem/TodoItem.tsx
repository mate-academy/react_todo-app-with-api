import cn from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDeleteTodo: (todoId: number) => void;
  isCompleted: boolean;
  onUpdate: (todoId: number, completedStatus: boolean) => void;
  isUpdatingTodoId: number | null;
  isCurrentlyUpdating: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  isCompleted,
  onUpdate,
  isUpdatingTodoId,
  isCurrentlyUpdating,
}) => {
  const [detedTodoId, setDeletedTodoId] = useState(0);

  const handleDeleteTodo = (id: number) => {
    setDeletedTodoId(id);
    onDeleteTodo(id);
  };

  const handleCompletedCanhge = (todoId: number, completedStatus: boolean) => {
    onUpdate(todoId, completedStatus);
  };

  const isActive = detedTodoId === todo.id
  || isCompleted
  || isUpdatingTodoId === todo.id
  || isCurrentlyUpdating;

  return (
    <div className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleCompletedCanhge(todo.id, !todo.completed)}
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={() => handleDeleteTodo(todo.id)}
      >
        ×

      </button>

      <div className={cn('modal', 'overlay', {
        'is-active': isActive,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
