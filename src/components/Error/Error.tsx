import classNames from 'classnames';
import { ErrorType } from '../../types/Error';
import { useEffect } from 'react';
import { memo } from 'react';

type Props = {
  errorMessage: ErrorType;
  setErrorMessage: (error: ErrorType) => void;
  clearErrorMessage: () => void;
};

export const Error: React.FC<Props> = memo(
  ({ errorMessage, setErrorMessage, clearErrorMessage }) => {
    useEffect(() => {
      let timeoutId: NodeJS.Timeout;

      if (errorMessage) {
        timeoutId = setTimeout(() => {
          setErrorMessage(ErrorType.noError);
        }, 3000);
      }

      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }, [errorMessage, setErrorMessage]);

    return (
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
        hidden={!errorMessage}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={clearErrorMessage}
        />
        {errorMessage}
      </div>
    );
  },
);

Error.displayName = 'Error';
