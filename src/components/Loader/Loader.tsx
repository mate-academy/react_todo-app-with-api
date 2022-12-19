import classNames from 'classnames';
import React from 'react';

interface Props {
  isAdding?: boolean;
  isLoading?: boolean;
  id?: number;
  loadingTodoIds?: number[];
}

export const Loader: React.FC<Props> = ({
  isAdding,
  isLoading,
  loadingTodoIds,
  id,
}) => (
  <div
    data-cy="TodoLoader"
    className={classNames(
      'modal overlay',
      {
        'is-active': isAdding || (loadingTodoIds.includes(id) && isLoading),
      },
    )}
  >
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
);
