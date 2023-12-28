import cn from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Props } from '../../types/TodoItem';

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  handleDeleteTodo = () => Promise.resolve(),
  handleCompleteTodo = () => Promise.resolve(),
  handleChangeTodoTitle = () => Promise.resolve(),
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const editTodo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editTodo.current) {
      editTodo.current.focus();
    }
  }, [isEditing]);

  const handleEditedTitleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTodoTitle = editedTitle.trim();

    if (!trimmedTodoTitle.length) {
      handleDeleteTodo(todo.id);

      return;
    }

    if (trimmedTodoTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    try {
      await handleChangeTodoTitle(
        todo.id,
        trimmedTodoTitle,
      );
      setIsEditing(false);
    } catch (e) {
      editTodo?.current?.focus();
    }
  };

  return (
    <>
      <div
        data-cy="Todo"
        className={cn('todo',
          {
            completed: todo.completed,
          })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            defaultChecked={todo.completed}
            onClick={() => handleCompleteTodo(todo.id, !todo.completed)}
          />
        </label>

        {isEditing ? (
          <form onSubmit={handleEditedTitleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="What needs to be done? Deleted if empty"
              value={editedTitle}
              ref={editTodo}
              onChange={(event) => setEditedTitle(event.target.value)}
              onKeyUp={event => {
                if (event.key === 'Escape') {
                  setIsEditing(false);
                }
              }}
              onBlur={handleEditedTitleSubmit}
            />
          </form>
        ) : (
          <>
            <span
              onDoubleClick={() => setIsEditing(true)}
              data-cy="TodoTitle"
              className="todo__title"
            >
              {todo.title}
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

        {/* overlay will cover the todo while it is being updated */}
        <div
          data-cy="TodoLoader"
          className={cn('modal overlay',
            {
              'is-active': isLoading,
            })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
