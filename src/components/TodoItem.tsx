import { FC, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TodoEdit } from './TodoEdit';

interface Props {
  todo: Todo;
  onDelete: (todoId: number) => void;
  onUpdate: (id: number, status: boolean, title: string) => void;
  loadingIds: number[];
  editTodo: (id:number, data: Partial<Todo>) => void
}

export const TodoItem: FC<Props> = ({
  todo,
  onUpdate,
  onDelete,
  loadingIds,
  editTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const isActive = loadingIds.includes(todo.id);

  const handleEditing = () => {
    setIsEditing(true);
  };

  return (
    <div
      key={todo.id}
      onDoubleClick={handleEditing}
      className={cn('todo',
        { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onUpdate(todo.id, !todo.completed, todo.title)}
        />
      </label>
      {isEditing
        ? (
          <TodoEdit
            todo={todo}
            setIsEditing={setIsEditing}
            // isEditing={isEditing}
            // onUpdate={onUpdate}
            // onDelete={onDelete}
            editTodo={editTodo}
          />
        )
        : (
          <>
            <span
              className="todo__title"
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => onDelete(todo.id)}
            >
              ×
            </button>

          </>
        )}

      <div className={cn('modal overlay',
        { 'is-active': isActive })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
