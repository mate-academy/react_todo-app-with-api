import classNames from 'classnames';
import React from 'react';
import './Loader.scss';

type Props = {
  isLoading: boolean;
};

export const Loader: React.FC<Props> = ({ isLoading }) => (
  <div className={classNames(
    'modal overlay',
    {
      'is-active': isLoading,
    },
  )}
  >
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
);
