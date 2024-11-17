import classNames from 'classnames';
import { ErrorMessages } from '../enums/ErrorMessages';
import { Dispatch, FC, SetStateAction, useEffect } from 'react';

interface ErrorsProps {
  errorMessage: ErrorMessages;
  setErrorMessage: Dispatch<SetStateAction<ErrorMessages>>;
}

export const Errors: FC<ErrorsProps> = ({ errorMessage, setErrorMessage }) => {
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(ErrorMessages.NO_ERRORS);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage, setErrorMessage]);

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
        onClick={() => setErrorMessage(ErrorMessages.NO_ERRORS)}
      />
      {errorMessage}
    </div>
  );
};
