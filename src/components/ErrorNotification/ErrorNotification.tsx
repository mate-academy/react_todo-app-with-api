import classNames from 'classnames';
import * as React from 'react';
import { ErrorMessages } from '../../types';

type Props = {
  currentError: string | null;
  onSetError: (errorType: ErrorMessages) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  currentError,
  onSetError,
}) => {
  React.useEffect(() => {
    if (!currentError) {
      return;
    }

    const timer = setTimeout(() => {
      onSetError(ErrorMessages.WithoutError);
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentError, onSetError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !currentError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onSetError(ErrorMessages.WithoutError)}
      />
      {currentError}
    </div>
  );
};
