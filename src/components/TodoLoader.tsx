import classNames from 'classnames';
import React from 'react';

export const TodoLoader: React.FC<{ loading: boolean }> = ({ loading }) => (
  <div
    data-cy="TodoLoader"
    className={classNames('modal', 'overlay', { 'is-active': loading })}
  >
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
);
