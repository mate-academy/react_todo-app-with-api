import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  deleteTodo: (todoId: number) => void,
  uptadeTodoStatus: (todoId: number, completed: boolean) => void,
  onChangeTodoTitle: (todoId: number, newTitle: string) => void,
  loading: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todo, loading,
  deleteTodo, uptadeTodoStatus, onChangeTodoTitle,
}) => {
  const { id, completed, title } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const titleField = useRef<HTMLInputElement>(null);

  const handleDeleteTodo = () => {
    deleteTodo(id);
  };

  const titleChanger = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleTodoStatusChange = () => {
    uptadeTodoStatus(id, !completed);
  };

  const handleEditTitle = () => {
    setIsEditing(true);

    if (!editedTitle) {
      handleDeleteTodo();
    } else if (editedTitle === title) {
      setIsEditing(false);
    }

    onChangeTodoTitle(id, editedTitle);
    setIsEditing(false);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleEditTitle();
    } else if (event.key === 'Escape') {
      setEditedTitle(title);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (editedTitle) {
      titleField.current?.focus();
    }
  }, [editedTitle, id]);

  return (
    <>
      <div className={classNames(
        'todo',
        { completed },
      )}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={completed}
            onClick={handleTodoStatusChange}
            id={`toggle-completed-${id}`}
            disabled={loading}
            ref={titleField}
          />
        </label>

        {!isEditing ? (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={handleDeleteTodo}
              disabled={loading}
            >
              ×
            </button>
          </>
        ) : (
          <input
            type="text"
            className="todo__title"
            value={editedTitle}
            ref={titleField}
            onKeyUp={handleKeyUp}
            onBlur={handleEditTitle}
            onChange={titleChanger}
          />
        )}

        <div className={classNames('modal overlay', {
          'is-active': loading,
        })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
