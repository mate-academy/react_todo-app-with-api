import classNames from 'classnames';
import React from 'react';

type Props = {
  loader: boolean;
};

export const Loader: React.FC<Props> = ({ loader }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', { 'is-active': loader })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
