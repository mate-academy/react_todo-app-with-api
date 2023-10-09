import React, { useEffect } from 'react';
import classNames from 'classnames';
import { ErrorMessages } from '../../utils/ErrorMessages';

interface Props {
  errorMessage: string,
  setErrorMessage: (value: string) => void,
}

export const ErrorMessage: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage(ErrorMessages.NONE);
      }, 3000);
    }
  }, [errorMessage]);

  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !errorMessage },
    )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={() => setErrorMessage(ErrorMessages.NONE)}
      />
      {errorMessage}
    </div>
  );
};
