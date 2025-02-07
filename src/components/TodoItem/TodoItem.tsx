import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  onDelete?: (todoId: number) => Promise<boolean>;
  onUpdate?: (updatedTodo: Todo) => Promise<boolean>;
  isLoading?: boolean;
};

export const TodoItem: React.FC<Props> = React.memo(
  ({
    todo,
    onDelete = () => Promise.resolve(),
    onUpdate = () => Promise.resolve(),
    isLoading = false,
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTrigger, setEditTrigger] = useState(false);
    const [updatedTitle, setUpdatedTitle] = useState(todo.title);
    const todoItemInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (isEditing) {
        todoItemInputRef.current?.focus();
      }
    }, [isEditing, editTrigger]);

    const handleDeleteTodo = () => {
      onDelete(todo.id);
    };

    const handleToggleCompleted = () => {
      onUpdate({ ...todo, completed: !todo.completed });
    };

    const handleUpdateTodo = async (event?: React.FormEvent) => {
      event?.preventDefault();

      const trimmedUpdatedTitle = updatedTitle.trim();

      if (trimmedUpdatedTitle === '') {
        handleDeleteTodo();

        return;
      }

      if (trimmedUpdatedTitle !== todo.title) {
        const isSuccessUpdated = await onUpdate({
          ...todo,
          title: trimmedUpdatedTitle,
        });

        if (!isSuccessUpdated) {
          setEditTrigger(prev => !prev);

          return;
        }
      }

      setIsEditing(false);
    };

    const handleKeyUpEvent = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setUpdatedTitle(todo.title);
        setIsEditing(false);
      }
    };

    return (
      <div
        data-cy="Todo"
        className={classNames('todo', { completed: todo.completed })}
      >
        <label
          className="todo__status-label"
          htmlFor={`todo__status-${todo.id}`}
        >
          {/* this checkbox should be checked if todo is completed */}
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            id={`todo__status-${todo.id}`}
            checked={todo.completed}
            onChange={handleToggleCompleted}
          />
        </label>

        {isEditing ? (
          <form onSubmit={handleUpdateTodo}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={todoItemInputRef}
              value={updatedTitle}
              onBlur={handleUpdateTodo}
              onChange={event => setUpdatedTitle(event.target.value)}
              onKeyUp={handleKeyUpEvent}
            ></input>
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

            {/* Remove button appears only on hover */}
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleDeleteTodo}
              disabled={isLoading}
            >
              ×
            </button>
          </>
        )}

        {/* overlay will cover the todo while it is being deleted or updated */}
        <div
          data-cy="TodoLoader"
          className={classNames('modal', 'overlay', {
            'is-active': isLoading,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);

TodoItem.displayName = 'TodoItem';
