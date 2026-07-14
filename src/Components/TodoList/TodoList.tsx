import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import React, { useRef, useState } from 'react';
import { TodoListProps } from '../../types/TodoListProps';

export const TodoList = ({
  filteredTodos,
  tempTodo,
  deleteId,
  deleteData,
  changeStatusData,
  renameData,
}: TodoListProps) => {
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const editInputRef = useRef<HTMLInputElement>(null);
  const isSubmittingEdit = useRef(false);
  const isCancelling = useRef(false);

  const handleDelete = (id: number) => {
    deleteData(id);
  };

  const statusSubmit = (id: number) => {
    changeStatusData(id);
  };

  const handleDoubleClick = (todo: Todo) => {
    isCancelling.current = false;
    setEditingId(todo.id);
    setNewTitle(todo.title);
  };

  const cancelEditing = () => {
    isCancelling.current = true;
    setEditingId(null);
    setNewTitle('');
  };

  const handleSubmit = (todo: Todo) => {
    if (isCancelling.current || isSubmittingEdit.current) {
      return;
    }

    const normalizedTitle = newTitle.trim();

    if (normalizedTitle === todo.title) {
      cancelEditing();

      return;
    }

    if (normalizedTitle === '') {
      isSubmittingEdit.current = true;

      deleteData(todo.id)
        .then(() => {
          cancelEditing();
        })
        .catch(() => {
          editInputRef.current?.focus();
        })
        .finally(() => {
          isSubmittingEdit.current = false;
        });

      return;
    }

    isSubmittingEdit.current = true;

    renameData(todo.id, normalizedTitle)
      .then(() => {
        cancelEditing();
      })
      .catch(() => {
        editInputRef.current?.focus();
      })
      .finally(() => {
        isSubmittingEdit.current = false;
      });
  };

  const handleKeyUp = (
    event: React.KeyboardEvent<HTMLInputElement>,
    todo: Todo,
  ) => {
    if (event.key === 'Escape') {
      cancelEditing();
    } else if (event.key === 'Enter') {
      handleSubmit(todo);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <div
          data-cy="Todo"
          className={classNames(`todo ${todo.completed ? `completed` : ``}`)}
          key={todo.id}
        >
          <label
            className="todo__status-label"
            htmlFor={`todo-status-${todo.id}`}
            aria-label="Toggle todo status"
          >
            <input
              id={`todo-status-${todo.id}`}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onClick={() => statusSubmit(todo.id)}
              readOnly
            />
          </label>
          {editingId === todo.id ? (
            <input
              ref={editInputRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={inputEvent => setNewTitle(inputEvent.target.value)}
              onBlur={() => handleSubmit(todo)}
              onKeyUp={e => handleKeyUp(e, todo)}
              autoFocus
            />
          ) : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => handleDoubleClick(todo)}
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
            </>
          )}

          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': deleteId.includes(todo.id),
            })}
          >
            {/* eslint-disable-next-line max-len */}
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label" htmlFor="temp-todo-status">
            <input
              id="temp-todo-status"
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              aria-label="Toggle todo status"
              disabled
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            disabled
          >
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
