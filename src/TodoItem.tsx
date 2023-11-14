import React from 'react';
import cn from 'classnames';
import { TodoItemProps } from './types/TodoItemProps';

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isUpdatingAll,
  loadingTodo,
  editingId,
  editText,
  setEditingId,
  setEditText,
  handleEdit,
  toggleTodoStatus,
  deleteTodo,
}) => {
  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleTodoStatus(todo.id)}
        />
      </label>

      {editingId === todo.id ? (
        <form onSubmit={(e) => {
          e.preventDefault();
          handleEdit(todo.id, editText);
        }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={() => handleEdit(todo.id, editText)}
            onKeyUp={(e) => {
              if (e.key === 'Escape') {
                setEditingId(null);
                setEditText('');
              }
            }}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setEditingId(todo.id);
            setEditText(todo.title.trim());
          }}
        >
          {todo.title}
        </span>
      )}

      {editingId !== todo.id && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodo(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay',
          { 'is-active': isUpdatingAll || (loadingTodo === todo.id) })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
