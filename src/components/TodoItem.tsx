import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  loadingTodoId: number | null;
  editingTodoId: number | null;
  editingTitle: string;
  handleComplete: (todoId: number) => void;
  handleDelete: (todoId: number) => void;
  handleEditTodo: (todoId: number, title: string) => void;
  handleSaveEdit: (todoId: number) => void;
  handleCancelEdit: () => void;
  setEditingTitle: (title: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  loadingTodoId,
  editingTodoId,
  editingTitle,
  handleComplete,
  handleDelete,
  handleEditTodo,
  handleSaveEdit,
  handleCancelEdit,
  setEditingTitle,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', todo.completed && 'completed')}
      key={todo.id}
    >
      <label
        className="todo__status-label"
        onClick={() => handleComplete(todo.id)}
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          aria-label={`Mark "${todo.title}" as complete`}
        />
      </label>
      {editingTodoId === todo.id ? (
        <>
          <form onSubmit={e => e.preventDefault()}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editingTitle}
              onChange={e => setEditingTitle(e.target.value)}
              onBlur={() => handleSaveEdit(todo.id)}
              onKeyUp={e => {
                if (e.key === 'Enter') {
                  handleSaveEdit(todo.id);
                } else if (e.key === 'Escape') {
                  handleCancelEdit();
                }
              }}
              autoFocus
            />
          </form>
          <div
            data-cy="TodoLoader"
            className={classNames(
              'modal',
              'overlay',
              loadingTodoId === todo.id && 'is-active',
            )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => handleEditTodo(todo.id, todo.title)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={classNames(
              'modal',
              'overlay',
              loadingTodoId === todo.id && 'is-active',
            )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      )}
    </div>
  );
};
