/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import './TodoList.scss';

type Props = {
  todos: Todo[];
  toggleComplete: (todo: Todo) => Promise<void>;
  onDelete: (todoId: number) => Promise<void>;
  tempTodo: Todo | null;
  onEdit: (todo: Todo) => Promise<void>;
  focusHeaderInput: () => void;
  loadingTodosId: number[];
};

export const TodoList: React.FC<Props> = React.memo(function TodoList({
  todos,
  toggleComplete,
  onDelete,
  tempTodo,
  onEdit,
  focusHeaderInput,
  loadingTodosId,
}) {
  const [editedTodo, setEditedTodo] = useState<Todo | null>(null);
  const [editedTodoValue, setEditedTodoValue] = useState('');

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDelete(todoId: number) {
    onDelete(todoId).finally(() => focusHeaderInput());
  }

  function handleEditSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editedTodo) {
      return;
    }

    onEdit({
      ...editedTodo,
      title: editedTodoValue,
    })
      .then(() => {
        setEditedTodo(null);
      })
      .catch(() => inputRef.current?.focus());
  }

  function cancelEditing(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setEditedTodo(null);
      setEditedTodoValue('');
    }
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => toggleComplete(todo)}
            />
          </label>

          {editedTodo !== null && editedTodo.id === todo.id ? (
            <form onSubmit={handleEditSubmit} ref={formRef}>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={editedTodoValue}
                onChange={event => setEditedTodoValue(event.target.value)}
                onBlur={() => formRef.current?.requestSubmit()}
                onKeyUp={cancelEditing}
                ref={inputRef}
                autoFocus
              />
            </form>
          ) : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => {
                  setEditedTodo(todo);
                  setEditedTodoValue(todo.title);
                }}
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
            className={classNames('modal overlay', {
              'is-active': loadingTodosId.includes(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
      {tempTodo !== null && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          {/* 'is-active' class puts this modal on top of the todo */}
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
});
