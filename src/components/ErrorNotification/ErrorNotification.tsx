import React from 'react';
import { ErrorType } from '../../types/ErrorType';
import { errorMessages } from '../../constants/errorMessage';

type Props = {
  errorMessage: ErrorType | '';
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onClose,
}) => (
  <div
    data-cy="ErrorNotification"
    className={`notification is-danger is-light has-text-weight-normal ${errorMessage ? '' : 'hidden'}`}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={onClose}
    />
    {errorMessage && errorMessages[errorMessage]}
  </div>
);
