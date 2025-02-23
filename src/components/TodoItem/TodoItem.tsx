/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import React, { useContext, useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../../TodosContext/TodosContext';

interface Props {
  todo: Todo;
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    handleEditKeyUp,
    processingIds,
    handleEditTodoOnBlur,
    setEditedTodoTitle,
    handleSpanDoubleClick,
    handleDeleteTodo,
    editedTodoTitle,
    editedTodoId,
    handleEditTodo,
    handleCompleteChange,
  } = useContext(TodosContext);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {}}
          onClick={() => {
            handleCompleteChange(todo.id, !todo.completed);
          }}
        />
      </label>

      {editedTodoId === todo.id ? (
        <form onSubmit={event => handleEditTodo(event, todo.id)}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={inputRef}
            value={editedTodoTitle}
            onChange={event => setEditedTodoTitle(event.target.value)}
            onKeyUp={handleEditKeyUp}
            onBlur={() => handleEditTodoOnBlur(todo.id)}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            handleSpanDoubleClick(todo.id, todo.title);
          }}
        >
          {todo.title}
        </span>
      )}

      {/* Remove button appears only on hover */}
      {!editedTodoId && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => {
            handleDeleteTodo(todo.id);
          }}
        >
          ×
        </button>
      )}

      {/* 'is-active' class puts this modal on top of the todo */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': processingIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
