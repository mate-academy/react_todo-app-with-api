import React from 'react';
import cn from 'classnames';

type Props = {
  loading: boolean;
};

export const Loader: React.FC<Props> = ({ loading }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={cn('modal overlay', { 'is-active': loading })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
