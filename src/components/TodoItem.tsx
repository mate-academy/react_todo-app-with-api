/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  editingId: number | null;
  setEditingId: (id: number | null) => void;
  handleDeleteTodo: (id: number) => void;
  handleUpdateTodoText: (id: number, title: string) => void;
  handleUpdateTodoStatus: (
    todoId: number,
    title: string,
    newStatus: boolean,
  ) => void;
  activeTodoId: number | null;
  setOriginalTitle: (title: string) => void;
  originalTitle: string;
  activeTodoIds: number[];
  submitTodoUpdate: (todoId: number, newTitle: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  editingId,
  setEditingId,
  handleDeleteTodo,
  handleUpdateTodoStatus,
  activeTodoId,
  setOriginalTitle,
  originalTitle,
  activeTodoIds,
  submitTodoUpdate,
}) => {
  const [todoTitle, setTodoTitle] = useState<string>(todo.title);

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : 'item-enter-done'}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() =>
            handleUpdateTodoStatus(todo.id, todo.title, !todo.completed)
          }
        />
      </label>

      {editingId === todo.id ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            submitTodoUpdate(todo.id, todoTitle);
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            autoFocus
            value={todoTitle}
            onBlur={() => {
              submitTodoUpdate(todo.id, todoTitle);
            }}
            onChange={e => setTodoTitle(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Escape') {
                e.preventDefault();
                setEditingId(null);
                setTodoTitle(originalTitle);
              }

              if (e.key === 'Enter') {
                e.preventDefault();
                submitTodoUpdate(todo.id, todoTitle);
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setEditingId(todo.id);
              setOriginalTitle(todo.title);
            }}
          >
            {todo.title.trim()}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${
          activeTodoId === todo.id || activeTodoIds.includes(todo.id)
            ? 'is-active'
            : ''
        }`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
