import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type TodoListProps = {
  deleting: number[];
  onDelete: (id: number) => void;
  visibleTodos: Todo[];
  toggleTodoStatus: (id: number, completed: boolean) => void;
  updatingIds: number[];
  editingId: number | null;
  editingTitle: string;
  setEditingId: (id: number | null) => void;
  setEditingTitle: (title: string) => void;
  onRename: (id: number, title: string) => void;
  editInputRef: React.RefObject<HTMLInputElement>;
};

export const TodoList: React.FC<TodoListProps> = ({
  deleting,
  onDelete,
  visibleTodos,
  toggleTodoStatus,
  updatingIds,
  editingId,
  editingTitle,
  setEditingId,
  setEditingTitle,
  onRename,
  editInputRef,
}) => {
  const handleSave = (todo: Todo) => {
    if (editingTitle.trim() === '') {
      onDelete(todo.id);
    } else if (editingTitle.trim() === todo.title) {
      setEditingId(null);
    } else {
      onRename(todo.id, editingTitle.trim());
    }
  };

  return (
    <div>
      {visibleTodos.map(todo => (
        <div
          data-cy="Todo"
          key={todo.id}
          className={classNames('todo', {
            completed: todo.completed,
          })}
        >
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={() => toggleTodoStatus(todo.id, todo.completed)}
          />
          {editingId === todo.id ? (
            <form
              onSubmit={event => {
                event.preventDefault();
                handleSave(todo);
              }}
            >
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                value={editingTitle}
                onChange={event => setEditingTitle(event.target.value)}
                onKeyUp={event => {
                  if (event.key === 'Escape') {
                    setEditingId(null);
                    setEditingTitle(todo.title);
                  }
                }}
                onBlur={() => {
                  handleSave(todo);
                }}
                ref={editInputRef}
              />
            </form>
          ) : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => {
                  setEditingTitle(todo.title);
                  setEditingId(todo.id);
                }}
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
            className={classNames('modal overlay', {
              'is-active':
                deleting.includes(todo.id) || updatingIds.includes(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </div>
  );
};
