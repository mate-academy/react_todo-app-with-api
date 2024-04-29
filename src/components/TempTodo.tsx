import React, { useContext } from 'react';
import { StateContext } from '../context/ContextReducer';

export const TempTodo: React.FC = () => {
  const { query } = useContext(StateContext);

  return (
    <div data-cy="Todo" className="todo">
      <input data-cy="TodoStatus" type="checkbox" className="todo__status" />

      <span data-cy="TodoTitle" className="todo__title">
        {query}
      </span>

      <div data-cy="TodoLoader" className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
