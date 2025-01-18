import React from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string;
  showErrorMessage: boolean;
  setShowErrorMessage: (newValue: boolean) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  showErrorMessage,
  setShowErrorMessage,
}) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !showErrorMessage },
    )}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={() => setShowErrorMessage(false)}
    />

    {errorMessage}
  </div>
);
