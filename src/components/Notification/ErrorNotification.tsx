import classNames from 'classnames';
import React from 'react';

type Props = {
  isError: boolean,
  errorTitle: string,
  setIsError: React.Dispatch<React.SetStateAction<boolean>>,
};

export const ErrorNotification: React.FC<Props> = ({
  isError, errorTitle, setIsError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !isError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        aria-label="x"
        className="delete"
        onClick={() => setIsError(false)}
      />
      {errorTitle}
    </div>
  );
};
