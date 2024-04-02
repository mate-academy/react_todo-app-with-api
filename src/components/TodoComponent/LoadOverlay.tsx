import React from 'react';
import cn from 'classnames';

interface LoaderProps {
  showUpdating: boolean;
}
export const LoadOverlay: React.FC<LoaderProps> = ({ showUpdating }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={cn('modal', 'overlay', {
        'is-active': showUpdating,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
