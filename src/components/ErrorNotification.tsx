import React from 'react';
import classNames from 'classnames';
import { ErrorMessages } from '../types/errorMessages';

type Props = {
  errorMessage: string;
  onHideErrorButtonClick: (message: ErrorMessages) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onHideErrorButtonClick,
}) => {
  return (
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
        onClick={() => onHideErrorButtonClick(ErrorMessages.none)}
      />
      {errorMessage}
      <br />
    </div>
  );
};
