import React, {
  ChangeEvent, FormEvent, useState, useRef, useEffect,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  removeTodo: (todoId: number) => void,
  isLoading: boolean,
  toggleCompletedTodo: (todoId: number, completed: boolean) => void,
  renameTitle: (todoId: number, todoTitle: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  isLoading,
  toggleCompletedTodo,
  renameTitle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleSubmitOnBlur = (event: FormEvent) => {
    event.preventDefault();

    if (editedTitle === '') {
      removeTodo(todo.id);
    }

    if (todo.title !== editedTitle) {
      renameTitle(todo.id, editedTitle);
    }

    setIsEditing(false);
  };

  const handleEscapeKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTitle(todo.title);
      setIsEditing(false);
    }
  };

  const handleRemoveTodo = (todoId: number) => {
    removeTodo(todoId);
  };

  const handleToggleCompletetTodo = () => {
    toggleCompletedTodo(todo.id, !todo.completed);
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
          onChange={handleToggleCompletetTodo}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmitOnBlur}>
          <input
            type="text"
            className="todo__title"
            value={editedTitle}
            onChange={handleInputChange}
            onKeyUp={handleEscapeKeyUp}
            onBlur={handleSubmitOnBlur}
            ref={inputRef}
            placeholder="Empty todo will be deleted"
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
