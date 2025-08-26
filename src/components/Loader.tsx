/* eslint-disable prettier/prettier */
import React from 'react';

interface Props{
  todoId: number;
  loadingTodoIds: number[];
}


/* eslint-disable prettier/prettier */
export const Loader: React.FC<Props> = ({todoId, loadingTodoIds}) => {
  const isUpdating = loadingTodoIds.includes(todoId);

  return (
    <div
      data-cy="TodoLoader"
      className={`modal overlay ${isUpdating ? 'is-active': ''}`}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
