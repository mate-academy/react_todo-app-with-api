import React, { useState, useRef, useEffect } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  isLoadingTodo: number[],
  onRemoveTodo: (todoId: number) => void,
  onEditTodo: (todoId: number, properties: Partial<Todo>) => void,
};

export const TodoInfo: React.FC<Props> = React.memo(({
  todo,
  isLoadingTodo,
  onRemoveTodo,
  onEditTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const removeTodo = () => onRemoveTodo(todo.id);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleSubmitTitle = () => {
    if (newTitle.trim() === '') {
      onRemoveTodo(todo.id);
    } else if (newTitle.trim() !== todo.title) {
      setIsEditing(false);
      onEditTodo(todo.id, { title: newTitle });
    } else {
      setIsEditing(false);
    }
  };

  const handleCancelTitle = () => {
    setNewTitle(todo.title);
    setIsEditing(false);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (event.key === 'Escape') {
      handleCancelTitle();
    }
  };

  const handleBlur = () => {
    handleSubmitTitle();
  };

  const handleEditTitle = () => {
    setIsEditing(true);
  };

  const editStatusHandler = () => {
    onEditTodo(todo.id, { completed: !todo.completed });
  };

  const isActiveModal = isLoadingTodo.includes(todo.id);

  return (
    <div className={cn('todo', { completed: todo.completed })}>

      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={editStatusHandler}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={handleSubmitTitle}
          onBlur={handleBlur}
        >
          <input
            type="text"
            className="todo__title-field"
            value={newTitle}
            onChange={handleTitleChange}
            onKeyUp={handleKeyUp}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={handleEditTitle}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={removeTodo}
          >
            ×
          </button>
        </>
      )}

      <div className={cn('modal overlay', {
        'is-active': isActiveModal,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
