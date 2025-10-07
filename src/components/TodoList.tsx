/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  handleDeleteTodo: (todoId: number) => void;
  processingIds: number[];
  handleToggleTodo: (todo: Todo) => void;
  editingId: number | null;
  editingTitle: string;
  setEditingTitle: React.Dispatch<React.SetStateAction<string>>;
  handleUpdateTodo: (todoId: number, newTitle: string) => Promise<void>;
  setEditingId: React.Dispatch<React.SetStateAction<number | null>>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  handleDeleteTodo,
  processingIds,
  handleToggleTodo,
  editingId,
  editingTitle,
  setEditingTitle,
  handleUpdateTodo,
  setEditingId,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <div
        data-cy="Todo"
        className={`todo ${todo.completed ? 'completed' : ''}`}
        key={todo.id}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            readOnly
            onChange={() => handleToggleTodo(todo)}
          />
        </label>
        {editingId === todo.id ? (
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editingTitle}
            autoFocus
            onChange={e => setEditingTitle(e.target.value)}
            onBlur={() => handleUpdateTodo(todo.id, editingTitle)}
            onKeyUp={e => {
              if (e.key === 'Enter') {
                handleUpdateTodo(todo.id, editingTitle);
              }

              if (e.key === 'Escape') {
                setEditingId(null);
              }
            }}
          />
        ) : (
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setEditingId(todo.id);
              setEditingTitle(todo.title);
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
            onClick={() => handleDeleteTodo(todo.id)}
          >
            ×
          </button>
        )}

        <div
          data-cy="TodoLoader"
          className={`modal overlay ${processingIds.includes(todo.id) ? 'is-active' : ''}`}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    ))}
    {tempTodo && (
      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={false}
            readOnly
          />
        </label>
        <span data-cy="TodoTitle" className="todo__title">
          {tempTodo.title}
        </span>
        <button type="button" className="todo__remove">
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
