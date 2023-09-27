import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { client } from '../../utils/fetchClient';

type Props = {
  todo: Todo,
  processingIds: number[],
  onDelete: (id: number) => void,
  onToggle: (todoId: number) => void,
  togglingId: number | null,
  onUpdate: (todoId: number, data: Todo) => void,
  areSubmiting: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  processingIds,
  onDelete,
  onToggle,
  togglingId,
  onUpdate,
  areSubmiting,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleTodoTitleChange = () => {
    setIsEditing(true);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const currentTodoTitle = todo.title;

    if (newTodoTitle === currentTodoTitle) {
      setIsEditing(false);
    } else if (newTodoTitle.trim() === '') {
      onDelete(todo.id);
    } else {
      setIsEditing(true);
      client
        .patch(`/todos/${todo.id}`, { title: newTodoTitle })
        .then(() => {
          setIsEditing(false);
          onUpdate(todo.id, { ...todo, title: newTodoTitle });
        })
        .catch(() => {
          setIsEditing(false);
          onUpdate(todo.id, todo);
        });
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => onToggle(todo.id)}
          onChange={() => onUpdate(todo.id, todo)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleFormSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={newTodoTitle}
            ref={inputRef}
            onChange={(event) => setNewTodoTitle(event.target.value)}
            onBlur={handleFormSubmit}
            onKeyUp={handleKeyUp}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </form>
      ) : (
        <span
          className="todo__title"
          data-cy="TodoTitle"
          onDoubleClick={handleTodoTitleChange}
        >
          {todo.title}
        </span>
      )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
        disabled={processingIds.includes(todo.id)
          || togglingId === todo.id
          || areSubmiting}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay', {
            'is-active': processingIds.includes(todo.id)
              || togglingId === todo.id
              || areSubmiting,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
