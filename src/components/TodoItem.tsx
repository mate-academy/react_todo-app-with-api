/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useRef, useState, useEffect } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  checkedTodoCompleted: (id: number, completed: boolean) => void;
  removeTodo: (id: number) => void;
  deletingTodoId: number[];
  loadingTodo: number[];
  saveEdit: (id: number, newTitle: string) => Promise<boolean>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  checkedTodoCompleted,
  removeTodo,
  deletingTodoId,
  loadingTodo,
  saveEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const somethingRef = useRef(false);
  const escapeRef = useRef(false);
  const focusRef = useRef<HTMLInputElement>(null);

  const newEditTitle = editTitle.trim();

  function handleEdit() {
    if (somethingRef.current === true) {
      return;
    }

    somethingRef.current = true;

    if (newEditTitle === '') {
      somethingRef.current = false;

      return removeTodo(todo.id);
    }

    if (newEditTitle === todo.title) {
      somethingRef.current = false;

      return setIsEditing(false);
    }

    saveEdit(todo.id, newEditTitle).then(result => {
      if (result) {
        setIsEditing(false);
      }

      somethingRef.current = false;
    });
  }

  useEffect(() => {
    if (isEditing) {
      focusRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => checkedTodoCompleted(todo.id, !todo.completed)}
        />
      </label>
      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEditing(true);

              escapeRef.current = false;
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => removeTodo(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form
          onSubmit={event => {
            event.preventDefault();
            handleEdit();
          }}
        >
          <input
            data-cy="TodoTitleField"
            value={editTitle}
            ref={focusRef}
            type="text"
            className="todo__title-field"
            placeholder="What needs to be done?"
            onChange={event => setEditTitle(event.target.value)}
            onBlur={() => {
              if (escapeRef.current) {
                return;
              }

              handleEdit();
            }}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setIsEditing(false);
                escapeRef.current = true;
              }
            }}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${
          deletingTodoId.includes(todo.id) || loadingTodo.includes(todo.id)
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
