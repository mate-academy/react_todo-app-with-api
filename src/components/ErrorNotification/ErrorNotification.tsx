import React, {
  FunctionComponent,
  useEffect,
} from 'react';
import classnames from 'classnames';
import { Errors } from '../../types/Errors';

interface ErrorProps {
  errorMessage: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<Errors>>;
}

export const ErrorNotification: FunctionComponent<ErrorProps> = ({
  errorMessage,
  setErrorMessage,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage(Errors.None);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      data-cy="ErrorNotification"
      className={classnames(
        'notification is-danger is-light has-text-weight-normal',
        { 'is-hidden': !errorMessage.length },
      )}
    >
      <button
        aria-label="errorButton"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(Errors.None)}
      />

      {errorMessage}
    </div>
  );
};
