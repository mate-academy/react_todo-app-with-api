import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface TodoItemProps {
  todo: Todo;
  loadingTodoIds: number[] | [];
  editingTodoId: number | null;
  editLoader: number | null;
  newTitle: string;
  editInputRef: React.LegacyRef<HTMLInputElement>;
  handleDelete: (id: number) => void;
  handleUpdateStatus: (id: number) => void;
  handleEditTitle: (id: number, title: string) => void;
  handleSaveEditTitle: (id: number) => void;
  setNewTitle: (newTitle: string) => void;
  setEditingTodoId: (editingTodoId: number | null) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  loadingTodoIds,
  editingTodoId,
  editLoader,
  newTitle,
  editInputRef,
  handleDelete,
  handleUpdateStatus,
  handleEditTitle,
  handleSaveEditTitle,
  setNewTitle,
  setEditingTodoId,
}) => {
  return (
    <>
      <div
        data-cy="Todo"
        className={classNames('todo', { completed: todo.completed })}
        key={todo.id}
      >
        <label
          className="todo__status-label"
          htmlFor={`todo-${todo.id}`}
          onClick={() => {
            handleUpdateStatus(todo.id);
          }}
        >
          {
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
            />
          }
        </label>

        {editingTodoId === todo.id ? (
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSaveEditTitle(todo.id);
            }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={editInputRef}
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onBlur={() => handleSaveEditTitle(todo.id)}
              onKeyDown={e => {
                if (e.key === `Escape`) {
                  setEditingTodoId(null);
                  setNewTitle('');
                }
              }}
            />
            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': editLoader === todo.id,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                handleEditTitle(todo.id, todo.title);
              }}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => {
                handleDelete(todo.id);
              }}
            >
              ×
            </button>
            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': loadingTodoIds?.some(t => t === todo.id),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </>
        )}
      </div>
    </>
  );
};
