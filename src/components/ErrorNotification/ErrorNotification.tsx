/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import classNames from 'classnames';

interface Props {
  errorMessage: string;
  setErrorHide: () => void;
}

export const ErrorNotification: React.FC<Props> = (props) => {
  const { errorMessage, setErrorHide } = props;

  useEffect(() => {
    const timerId = setTimeout(setErrorHide, 3000);

    return () => clearTimeout(timerId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification', 'is-danger', 'is-light', 'has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={setErrorHide}
      />

      {errorMessage}
    </div>
  );
};
