import React from 'react';

type Props = {
  todoTitle: string,
};

export const TodoItem: React.FC<Props> = ({ todoTitle }) => {
  return (
    <div className="todo">
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      <span
        className="todo__title"
      >
        {todoTitle}
      </span>

      <button type="button" className="todo__remove">×</button>

      <div className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
