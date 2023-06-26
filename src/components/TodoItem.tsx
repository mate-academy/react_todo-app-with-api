import React, {
  useState, useRef, useEffect, FormEvent, ChangeEvent,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface ItemProps {
  todo: Todo,
  isLoading: boolean,
  toggleCompleted: (todoId: number, completed: boolean) => void,
  changeTitle: (todoId: number, todoTitle: string) => void,
  removeTodo: (todoId: number) => void,
}

export const TodoItem: React.FC<ItemProps> = ({
  todo,
  isLoading,
  toggleCompleted,
  changeTitle,
  removeTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleEscape = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTitle(todo.title);
      setIsEditing(false);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSubmitOnBlur = (event: FormEvent) => {
    event.preventDefault();

    if (editedTitle === '') {
      removeTodo(todo.id);
    }

    if (todo.title !== editedTitle) {
      changeTitle(todo.id, editedTitle);
    }

    setIsEditing(false);
  };

  const handleToggleCompleted = () => {
    toggleCompleted(todo.id, !todo.completed);
  };

  const handleRemoveTodo = (todoId: number) => {
    removeTodo(todoId);
  };

  return (
    <div
      key={todo.id}
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={handleToggleCompleted}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmitOnBlur}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Will be deleted if empty"
            value={editedTitle}
            ref={inputRef}
            onKeyUp={handleEscape}
            onBlur={handleSubmitOnBlur}
            onChange={handleInputChange}
          />
        </form>
      )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => handleRemoveTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <div className={classNames('modal', 'overlay', {
        'is-active': isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>
  );
};
