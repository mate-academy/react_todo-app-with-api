import React from 'react';
import classNames from 'classnames';

type Props = {
  id: number,
  isLoading: boolean | undefined,
};

export const Loader: React.FC<Props> = ({ id, isLoading }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames({
        modal: true,
        overlay: true,
        'is-active': isLoading || id === 0,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
