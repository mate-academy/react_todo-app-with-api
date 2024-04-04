/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Errors } from '../types/Types';
import { useState } from 'react';
import { deleteTodo, setTodoTitle } from '../api/todos';

type TodoItemProps = {
  title: string;
  completed: boolean;
  id: number;
  deleteCurrentTodo: (id: number) => void;
  deleteTodoByID: number | null | undefined;
  toggleCompleted: (id: number) => void;
  setErrorMessage: (error: Errors | null) => void;
  updateTodoTitle: (todoId: number, newTitle: string) => void;
};

export const TodoItem = ({
  title,
  completed,
  id,
  deleteCurrentTodo,
  deleteTodoByID,
  toggleCompleted,
  setErrorMessage,
  updateTodoTitle,
}: TodoItemProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editing, setEditing] = useState(false);
  const isActive = id === 0 || deleteTodoByID === id || isLoading === true;

  const changeCompleted = async () => {
    setIsLoading(true);
    try {
      await toggleCompleted(id);
    } catch {
      setErrorMessage(Errors.Update);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDoubleClick = () => {
    setEditedTitle(title.trim().replace(/\s+/g, ' '));
    setEditing(true);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const editedTitleTrimmed = editedTitle.trim();

    try {
      if (editedTitleTrimmed !== '' && editedTitleTrimmed !== title) {
        await setTodoTitle({ id, title: editedTitleTrimmed });
        updateTodoTitle(id, editedTitleTrimmed);
      } else if (editedTitleTrimmed === '') {
        deleteTodo(id);
      }
    } catch {
      setErrorMessage(Errors.Update);
      setEditedTitle(title);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedTitle(title);
    setEditing(false);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (editedTitle.trim() === title.trim()) {
        setEditing(false);
      } else if (editedTitle.trim() === '') {
        deleteCurrentTodo(id);
      } else {
        handleSubmit();
      }
    } else if (event.key === 'Escape') {
      handleCancel();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleBlur = async () => {
    if (editedTitle.trim() === '') {
      deleteCurrentTodo(id);
    }

    if (editing) {
      await handleSubmit();
    }

    if (!isLoading && editing) {
      setEditing(false);
    }
  };

  return (
    <div
      key={id}
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={changeCompleted}
        />
      </label>

      {editing ? (
        <input
          type="text"
          data-cy="TodoTitleField"
          className="todo__title-field"
          value={editedTitle}
          autoFocus
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          onBlur={handleBlur}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteCurrentTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
