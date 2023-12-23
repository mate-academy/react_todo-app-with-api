import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo
  onDelete: (todoId: number) => void
  onComplete: (todo: Todo) => void
  loadingTodos: number[]
  updateTodo: (newTodo: Todo) => Promise<void>
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onComplete,
  loadingTodos,
  updateTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTodoTitle, setEditedTodoTitle] = useState('');

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTodoTitle(todo.title);
  };

  const EditedTitleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (EditedTitleField.current) {
      EditedTitleField.current.focus();
    }
  });

  const handleEditSumbit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = editedTodoTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      onDelete(todo.id);

      return;
    }

    const editedTodo: Todo = {
      ...todo,
      title: trimmedTitle,
    };

    updateTodo(editedTodo)
      .then(() => {
        setIsEditing(false);
      });
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => onComplete(todo)}
          checked
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleEditSumbit}>
            <input
              ref={EditedTitleField}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editedTodoTitle}
              onChange={(event) => setEditedTodoTitle(event.target.value)}
              onBlur={handleEditSumbit}
              onKeyUp={handleKeyUp}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleEdit}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDelete(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loadingTodos.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
