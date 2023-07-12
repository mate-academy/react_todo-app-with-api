import React from 'react';
import cN from 'classnames';

type Props = {
  isVisible: boolean,
  errorText?: null | string,
  clearError: () => void,
};

export const ErrorMessage: React.FC<Props> = ({
  isVisible,
  errorText,
  clearError,
}) => (
  <div
    className={cN('notification is-danger',
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
