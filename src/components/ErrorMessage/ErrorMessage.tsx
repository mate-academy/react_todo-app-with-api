import React from 'react';
import classNames from 'classnames';

type Props = {
  isVisible: boolean,
  errorText: string,
  clearError: () => void,
};

export const ErrorMessage: React.FC<Props> = ({
  isVisible,
  errorText,
  clearError,
}) => (
  <div
    className={classNames('notification is-danger',
      'is-light has-text-weight-normal',
      {
        hidden: !isVisible,
      })}
  >
    <button
      aria-label="close-error"
      type="button"
      className="delete"
      onClick={clearError}
    />
    {errorText}
  </div>
);
