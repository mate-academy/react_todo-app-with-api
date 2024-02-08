/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect } from 'react';
import classNames from 'classnames';

interface Props {
  setErrorMessage: (error: string) => void,
  errorMessage: string,
}

export const ErrorNotification: React.FC<Props> = ({
  setErrorMessage,
  errorMessage,
}) => {
  useEffect(() => {
    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
