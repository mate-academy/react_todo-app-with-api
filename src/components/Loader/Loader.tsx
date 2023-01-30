import React, { memo } from 'react';
import cn from 'classnames';

type Props = {
  isLoading?: boolean;
};

export const Loader: React.FC<Props> = memo(({ isLoading }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={cn(
        'modal overlay',
        { 'is-active': isLoading },
      )}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
});
