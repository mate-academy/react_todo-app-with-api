import classNames from 'classnames';
import React from 'react';
import { ErrorMessageType } from '../../types/ErrorMessageType';

type Props = {
  errorMessage: string;
  setErrorMessage: (message: ErrorMessageType) => void;
};

export const ErrorMessage: React.FC<Props> = React.memo(
  ({
    errorMessage,
    setErrorMessage,
  }) => {
    return (
      <div className={
        classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )
      }
      >
        <button
          aria-label="close"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(ErrorMessageType.NONE)}
        />
        <span>{errorMessage}</span>
      </div>
    );
  },
);
