import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  loading: boolean;
  loadingIds: number[];
  handleDeleteTodo: (todoId: number) => Promise<boolean>;
  handleUpdateTodo: (updatedTodo: Todo) => Promise<boolean>;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  loading,
  loadingIds,
  handleDeleteTodo,
  handleUpdateTodo,
}) => {
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [updateFailed, setUpdateFailed] = useState(false);

  const inputUpdateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing || updateFailed) {
      inputUpdateRef.current?.focus();
      setUpdateFailed(false);
    }
  }, [editing, updateFailed]);

  const handleEditing = async () => {
    setEditedTitle(title => title.trim());
    if (!editedTitle) {
      const deleteResult = await handleDeleteTodo(todo.id);

      if (!deleteResult) {
        setUpdateFailed(true);
      }
    } else if (editedTitle === todo.title) {
      setEditedTitle(todo.title);
      setEditing(false);
    } else if (editedTitle !== todo.title) {
      const updateResult = await handleUpdateTodo({
        ...todo,
        title: editedTitle,
      });

      if (updateResult) {
        setEditing(false);
      } else {
        setUpdateFailed(true);
      }
    }
  };

  const handleBlur = () => {
    if (updateFailed) {
      return;
    }

    handleEditing();
  };

  const handlePressedKeyEditing = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter') {
      handleEditing();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditedTitle(todo.title);
      setEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          id="todoStatus"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() =>
            handleUpdateTodo({ ...todo, completed: !todo.completed })
          }
        />
        {}
      </label>

      {editing ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editedTitle}
          onChange={e => setEditedTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyUp={handlePressedKeyEditing}
          ref={inputUpdateRef}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setEditing(true)}
        >
          {editedTitle}
        </span>
      )}
      {!editing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDeleteTodo(todo.id)}
          disabled={loading}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': loadingIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
