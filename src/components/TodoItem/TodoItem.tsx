import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onTodoDelete?: (todoId: number) => void,
  onTodoUpdate?: (todo: Todo, newTodoTitle: string) => void
  isProcessing: boolean,
  handleChangeTodoStatus?: (todo: Todo) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onTodoDelete = () => {},
  onTodoUpdate = () => {},
  isProcessing,
  handleChangeTodoStatus = () => {},
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title);
  const [isModifiedTitle, setIsModifiedTitle] = useState(false);

  const handleTodoDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTodoTitleChange
    = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTodoTitle(event.target.value);

      setIsModifiedTitle(true);
    };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleTodoSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isModifiedTitle) {
      setIsEditing(false);

      return;
    }

    if (!todoTitle) {
      await onTodoDelete(todo.id);
    } else {
      await onTodoUpdate(todo, todoTitle);
    }

    setIsEditing(false);
  };

  const titleInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', 'item-enter-done',
        { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          onClick={() => handleChangeTodoStatus(todo)}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={handleTodoSave}
          onBlur={handleTodoSave}
        >
          <input
            ref={titleInputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be delecyed"
            value={todoTitle}
            onChange={handleTodoTitleChange}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            onDoubleClick={handleTodoDoubleClick}
            data-cy="TodoTitle"
            className="todo__title"
          >
            {todo.title}
          </span>

          <button
            onClick={() => {
              onTodoDelete(todo.id);
            }}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal', 'overlay',
          { 'is-active': isProcessing },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
