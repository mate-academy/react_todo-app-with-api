import React from 'react';
import classNames from 'classnames';
import { ErrorsType } from '../../types/ErrorsType';

interface Props {
  errorType: ErrorsType;
  isHidden: boolean;
  onClose: () => void;
}

export const ErrorNotification: React.FC<Props> = ({
  errorType, isHidden, onClose,
}) => (
  <div
    className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      {
        hidden: isHidden,
      },
    )}
  >
    <button
      type="button"
      className="delete"
      onClick={onClose}
      aria-label="delete error message"
    />

    {errorType}
  </div>
);
