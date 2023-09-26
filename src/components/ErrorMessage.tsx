/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string;
  onErrorMessageChange: (error: string) => void;
};

export const ErrorMessage: React.FC<Props> = ({
  errorMessage,
  onErrorMessageChange,
}) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !errorMessage },
    )}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={() => onErrorMessageChange('')}
    />
    {errorMessage}
  </div>
);
