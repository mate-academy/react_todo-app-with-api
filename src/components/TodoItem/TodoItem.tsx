/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { useTodos } from '../Store/Store';

type Props = {
  todo: Todo;
};

const TodoItem: React.FC<Props> = ({ todo }) => {
  const { id, completed, title } = todo;
  const { deleteData, isLoading, handleUpdateTodo, setErrorMessage } =
    useTodos();
  const [editedTitle, setEditedTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const handleClick = () => {
    handleUpdateTodo({
      ...todo,
      completed: !completed,
    });
  };

  const handleUpdate = async () => {
    try {
      if (editedTitle.trim() === '') {
        deleteData(id);
      } else if (editedTitle !== title) {
        await handleUpdateTodo({
          ...todo,
          title: editedTitle.trim(),
        });
      }

      setIsEditing(false);
    } catch (error) {
      setErrorMessage('Unable to update a todo');
    }
  };

  const handleBlur = () => {
    handleUpdate();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(title);
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: completed,
      })}
      id="todo"
    >
      <label className="todo__status-label" onClick={handleClick}>
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          id={`${id}`}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {title}
        </span>
      )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          deleteData(id);
          setSelected(id);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': (isLoading && id === selected) || id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
