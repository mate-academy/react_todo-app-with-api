import classNames from 'classnames';
import { useEffect } from 'react';
import { Error } from '../types/Error';

type Props = {
  errorMessage: Error,
  setErrorMessage: (error: Error) => void,
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  useEffect(() => {
    setTimeout(() => {
      setErrorMessage(Error.none);
    });
  }, []);

  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal', {
      },
    )}
    >
      {/* eslint-disable-next-line */}
      <button
        type="button"
        className="delete"
        onClick={() => setErrorMessage(Error.none)}
      />

      {errorMessage}
    </div>
  );
};
