import React from 'react';
import classNames from 'classnames';

interface Props {
  title: string;
  id: number;
  handleDelete: (id: number) => void;
  isTodoLoading: boolean;
}

export const TodoItem: React.FC<Props> = ({
  title,
  id,
  handleDelete,
  isTodoLoading,
}) => {
  return (
    <>
      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => handleDelete(id)}
      >
        ×
      </button>

      <div
        className={`modal overlay ${classNames({
          'is-active': isTodoLoading,
        })}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="todoapp__loading-content">
          <p className="todoapp__loading-content--caption">Loading...</p>
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
