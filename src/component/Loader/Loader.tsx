import classNames from 'classnames';
import React from 'react';
import './Loader.scss';

type Props = {
  isLoad: boolean;
};

export const Loader: React.FC<Props> = ({ isLoad }) => (
  <div className={classNames(
    'modal overlay',
    {
      'is-active': isLoad,
    },
  )}
  >
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
);
