import classNames from 'classnames';
import React from 'react';

type Props = {
  isToggling: boolean;
};

export const Loader: React.FC<Props> = () => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay is-active')}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
