import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { deleteTodoItem } from '../../utils/deleteTodoItem';
import { toggleCompletedTodo } from '../../utils/toggleTodo';
import { renameTodo } from '../../utils/renameTodo';
import { TodoItemProps } from '../../types/TodoItemProps';

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  todos,
  setTodos,
  setError,
  isLoadingIds,
  setIsLoadingIds,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const editingInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsEditing(false);
      }
    };

    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    editingInput.current?.focus();
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      onDoubleClick={() => {
        setIsEditing(true);
        setNewTitle(todo.title);
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() =>
            toggleCompletedTodo(todo, setIsLoadingIds, setTodos, setError)
          }
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={e => {
            renameTodo(
              e,
              newTitle,
              todo,
              todos,
              setTodos,
              setIsEditing,
              setIsLoadingIds,
              setError,
            );
          }}
        >
          <input
            ref={editingInput}
            disabled={isLoadingIds.length > 0}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={e => {
              renameTodo(
                e,
                newTitle,
                todo,
                todos,
                setTodos,
                setIsEditing,
                setIsLoadingIds,
                setError,
              );
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() =>
              deleteTodoItem(
                todo.id,
                todos,
                setTodos,
                setError,
                setIsLoadingIds,
              )
            }
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoadingIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
