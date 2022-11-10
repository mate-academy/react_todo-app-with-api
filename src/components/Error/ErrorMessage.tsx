import classNames from 'classnames';
import { useState } from 'react';

type Props = {
  errorAlert: string;
  setErrorAlert: (prop: string) => void;
};

export const ErrorMessage: React.FC<Props> = ({
  errorAlert,
  setErrorAlert,
}) => {
  const [noError, setNoError] = useState(false);

  if (errorAlert) {
    setTimeout(() => setErrorAlert(''), 2000);
  }

  const handleError = () => {
    setNoError(prev => !prev);
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={
        classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: noError,
          },
        )
      }
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="a problem"
        onClick={handleError}

      />

      {errorAlert}
    </div>
  );
};
