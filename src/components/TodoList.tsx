import React, { useEffect, useRef } from 'react';
import { Todo, TodoListProps } from '../types/Types';

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  deletingTodoIds,
  checkedTodoId,
  tempTodo,
  editingTodoId,
  editedTitle,
  handleDelete,
  handleMakeChecked,
  handleStartEditing,
  handleEditedTitleChange,
  handleCancelEditing,
  handleSubmitEditing,
}) => {
  const editInputRef = useRef<HTMLInputElement>(null);

  const cancelEdit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      handleCancelEditing();
    }
  };

  const submitEdit = (event: React.FormEvent<HTMLFormElement>, todo: Todo) => {
    event.preventDefault();
    handleSubmitEditing(todo);
  };

  useEffect(() => {
    if (editingTodoId !== null) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [editingTodoId]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <div
          data-cy="Todo"
          className={
            todo.completed
              ? `todo completed ${editingTodoId === todo.id ? 'editing' : ''}`
              : `todo ${editingTodoId === todo.id ? 'editing' : ''}`
          }
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              aria-label={`Mark "${todo.title}" as completed`}
              onChange={() => handleMakeChecked(todo)}
            />
          </label>

          {editingTodoId === todo.id ? (
            <form onSubmit={event => submitEdit(event, todo)}>
              <input
                ref={editInputRef}
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={editedTitle}
                onChange={event => handleEditedTitleChange(event.target.value)}
                onBlur={() => handleSubmitEditing(todo)}
                onKeyUp={cancelEdit}
              />
            </form>
          ) : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => handleStartEditing(todo)}
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
            </>
          )}

          <div
            data-cy="TodoLoader"
            className={
              deletingTodoIds.includes(todo.id) ||
              checkedTodoId.includes(todo.id)
                ? 'modal overlay is-active'
                : 'modal overlay'
            }
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo && (
        <div
          data-cy="Todo"
          className={tempTodo.completed ? 'todo completed' : 'todo'}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              aria-label={`Mark "${tempTodo.title}" as completed`}
              readOnly
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>
          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
