import React from 'react';
import cn from 'classnames';

type Props = {
  isAdding?: boolean;
  isDeleting?: boolean;
  isUpdating?: boolean;
};

export const TodoLoader: React.FC<Props> = ({
  isAdding,
  isDeleting,
  isUpdating,
}) => {
  return (
    <div
      data-cy="TodoLoader"
      className={cn(
        'modal',
        'overlay',
        { 'is-active': isAdding || isDeleting || isUpdating },
      )}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
