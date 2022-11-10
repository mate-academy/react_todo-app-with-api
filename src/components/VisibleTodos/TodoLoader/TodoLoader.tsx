import React from 'react';
import classNames from 'classnames';

type Props = {
  isModified: boolean,
  isActive: boolean,
};

export const TodoLoader: React.FC<Props> = ({ isModified, isActive }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames(
        'modal overlay',
        { 'is-active': isModified || isActive },
      )}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
