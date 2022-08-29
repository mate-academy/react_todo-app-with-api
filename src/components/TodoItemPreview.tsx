import React, { useContext } from 'react';
import { Loader } from './Loader';
import { StateContext } from './StateContext';

export const TodoItemPreview: React.FC = () => {
  const { todoTitle } = useContext(StateContext);

  return (
    <div data-cy="Todo" className="todo">
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{todoTitle}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
      >
        ×
      </button>
      <Loader />
    </div>
  );
};
