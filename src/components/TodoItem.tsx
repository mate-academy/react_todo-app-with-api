import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void
  updateTodo: (uTodo: Todo) => void,
  loadingTodoIds: number[]
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  updateTodo,
  loadingTodoIds,
}) => {
  const { id, completed, title } = todo;
  const [isEdited, setIsEdited] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const doubleClickHandler = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsEdited(true);
  };

  const handleUpdate = (event: React.FormEvent) => {
    event.preventDefault();
    const updatedTodo = { ...todo, title: newTitle };

    if (!newTitle) {
      onDelete(id);
    } else if (newTitle === title) {
      setIsEdited(false);
    } else {
      updateTodo(updatedTodo);
      setIsEdited(false);
    }
  };

  const handlerChangeStatus = (e: React.ChangeEvent) => {
    e.preventDefault();
    const updatedTodo = { ...todo, completed: !todo.completed };

    updateTodo(updatedTodo);
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEdited(false);
      setNewTitle(title);
    }
  };

  // const handleNewTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setNewTitle(event.target.value);
  // };

  return (
    <div
      className={classNames('todo', {
        completed,
      })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onChange={handlerChangeStatus}
        />
      </label>

      {isEdited ? (
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            onBlur={handleUpdate}
            onKeyUp={(event) => handleKeyUp(event)}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={doubleClickHandler}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <div className={classNames('modal overlay', {
        'is-active': loadingTodoIds.includes(id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
