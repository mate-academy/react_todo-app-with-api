import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  tempTodo: Todo | null;
  loadingIds: number[];
  isEditing: boolean;
  handleDeleteTodo: (todoId: number) => void;
  handleToggleStatus: (todoId: number, completed: boolean) => void;
  handleUpdateTodo: (todoId: number, newTitle: string) => void;
  handleCancelRename: () => void;
  startEditing: (todoId: number) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  tempTodo,
  loadingIds,
  isEditing,
  handleDeleteTodo,
  handleToggleStatus,
  handleUpdateTodo,
  startEditing,
  handleCancelRename,
}) => {
  const [editedTitle, setEditedTitle] = React.useState(todo.title);

  const saveChanges = () => {
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === '') {
      handleDeleteTodo(todo.id);
    } else if (trimmedTitle !== todo.title) {
      handleUpdateTodo(todo.id, trimmedTitle);
    } else {
      handleCancelRename();
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      saveChanges();
    } else if (event.key === 'Escape') {
      handleCancelRename();
    }
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
        loading: loadingIds.includes(todo.id) || todo.id === tempTodo?.id,
      })}
    >
      <button
        type="button"
        className="todo__status-label"
        // data-cy="TodoStatus"
        disabled={todo.id === tempTodo?.id || loadingIds.includes(todo.id)}
        onClick={() => handleToggleStatus(todo.id, !todo.completed)}
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly
        />
      </button>

      {isEditing ? (
        <input
          type="text"
          className="todo__title-field"
          value={editedTitle}
          onChange={e => setEditedTitle(e.target.value)}
          onBlur={saveChanges}
          onKeyUp={handleKeyUp}
          data-cy="TodoTitleField"
          autoFocus
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => startEditing(todo.id)}
        >
          {todo.title}
        </span>
      )}

      {todo.id !== tempTodo?.id && !isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDeleteTodo(todo.id)}
          disabled={loadingIds.includes(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todo.id === tempTodo?.id || loadingIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
