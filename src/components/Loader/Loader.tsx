import cn from 'classnames';
import React, { memo } from 'react';

type Props = {
  isLoading: boolean,
  isDeleting: boolean,
  isUpdating: boolean,
};

export const Loader: React.FC<Props> = memo(({
  isLoading,
  isDeleting,
  isUpdating,
}) => {
  return (
    <div
      data-cy="TodoLoader"
      className={cn(
        'modal',
        'overlay',
        { 'is-active': isLoading || isDeleting || isUpdating },
      )}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
});
