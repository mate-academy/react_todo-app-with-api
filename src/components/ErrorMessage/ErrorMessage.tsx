import classNames from 'classnames';
import { useEffect } from 'react';

interface Props {
  errorMessage: string;
  onErrorMessage: (string: string) => void;
}

export const ErrorMessage: React.FC<Props> = ({
  errorMessage,
  onErrorMessage,
}) => {
  const handleClose = () => {
    onErrorMessage('');
  };

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        handleClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        !errorMessage && 'hidden',
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleClose}
      />
      {errorMessage}
    </div>
  );
};
