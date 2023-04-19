import React from 'react';
import classNames from 'classnames';
import { ErrorMessage } from '../../enums/ErrorMessage';

type Props = {
  errorMessage: ErrorMessage;
  onClearErrorMessage: (value: ErrorMessage) => void;
};

export const ErrorModal: React.FC<Props> = ({
  errorMessage,
  onClearErrorMessage,
}) => (
  <div
    className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      {
        hidden: !errorMessage,
      },
    )}
  >
    <button
      aria-label="error-close-button"
      type="button"
      className="delete"
      onClick={() => onClearErrorMessage(ErrorMessage.NONE)}
    />
    {errorMessage}
  </div>
);
