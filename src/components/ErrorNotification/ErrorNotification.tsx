import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import { Errors } from '../../types/Errors';

type Props = {
  errorMessage: Errors;
  setErrorMessage: (newErrorMessage: Errors) => void;
};

// eslint-disable-next-line react/display-name
export const ErrorNotification: React.FC<Props> = React.memo(
  ({ errorMessage, setErrorMessage }) => {
    const timerId = useRef(0);

    useEffect(() => {
      if (errorMessage !== Errors.No_Error) {
        window.clearTimeout(timerId.current);

        timerId.current = window.setTimeout(
          () => setErrorMessage(Errors.No_Error),
          3000,
        );
      }
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
            setErrorMessage(Errors.No_Error);
            window.clearTimeout(timerId.current);
          }}
        />
        {errorMessage}
      </div>
    );
  },
);
