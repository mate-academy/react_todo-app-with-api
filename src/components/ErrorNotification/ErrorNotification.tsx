import { FC, useEffect } from 'react';
import cn from 'classnames';
import { Errors } from '../../types/Errors';

interface Props {
  setErrorMessage: (error: Errors) => void,
  errorMessage : string | null,
}

export const ErrorNotification: FC<Props> = (props) => {
  const {
    errorMessage,
    setErrorMessage,
  } = props;

  useEffect(() => {
    if (errorMessage) {
      const timeoutId = setTimeout(() => {
        setErrorMessage(Errors.Null);
      }, 3000);

      return () => clearTimeout(timeoutId);
    }

    return undefined;
  }, [errorMessage, setErrorMessage]);

  const hideError = () => {
    setErrorMessage(Errors.Null);
  };

  if (!errorMessage) {
    return null;
  }

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        type="button"
        aria-label="delete button"
        className={cn('delete', {
          hidden: !errorMessage,
        })}
        onClick={hideError}
      />
      {errorMessage}
    </div>
  );
};
