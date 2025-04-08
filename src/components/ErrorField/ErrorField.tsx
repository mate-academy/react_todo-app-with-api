import React, { useEffect, useState } from 'react';
import { ERROR } from '../../types/enums';
import cn from 'classnames';

type Props = {
  errorMessage: string;
  setErrorMessage: (message: ERROR) => void;
};

export const ErrorField: React.FC<Props> = React.memo(
  ({ errorMessage, setErrorMessage }) => {
    const [timerId, setTimerId] = useState<NodeJS.Timeout | undefined>();

    useEffect(() => {
      if (errorMessage === ERROR.no_error) {
        return;
      }

      setTimerId(
        setTimeout(() => {
          setErrorMessage(ERROR.no_error);
        }, 3000),
      );

      return () => {
        clearTimeout(timerId);
      };
    }, [errorMessage]);

    return (
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => {
            setErrorMessage(ERROR.no_error);
            clearTimeout(timerId);
          }}
        />
        {errorMessage}
      </div>
    );
  },
);

ErrorField.displayName = 'ErrorField';
