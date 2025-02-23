import classNames from 'classnames';
import { useEffect } from 'react';
import { Errors } from '../../types/Errors';

type Props = {
  errorMessage: Errors;
  setErrorMessage: (error: Errors) => void;
};

export const ErrorField = ({ errorMessage, setErrorMessage }: Props) => {
  useEffect(() => {
    let timerId = 0;

    if (errorMessage) {
      timerId = window.setTimeout(() => setErrorMessage(Errors.NONE), 3000);
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  });

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(Errors.NONE)}
      />
      {errorMessage}
    </div>
  );
};
