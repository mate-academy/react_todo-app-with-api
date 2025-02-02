import React from 'react';
import cn from 'classnames';

type Props = {
  id: number;
  loadingTodoId: number | null;
};

export const TodoLoader: React.FC<Props> = ({ id, loadingTodoId }) => (
  <div
    data-cy="TodoLoader"
    className={cn('modal overlay', {
      'is-active': id === 0 || id === loadingTodoId,
    })}
  >
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
);
