import { useEffect, useState } from 'react';
import { ErrorEnum } from '../../types/ErrorEnum';
import classNames from 'classnames';

type Props = {
  error: ErrorEnum | null;
  onDismiss: () => void;
};

export const ErrorNotification = ({ error, onDismiss }: Props) => {
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (!error) {
      setShowError(false);

      return;
    }

    setShowError(true);

    const timeoutId = window.setTimeout(() => {
      setShowError(false);
      onDismiss();
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [error, onDismiss]);

  const handleErrorClose = () => {
    setShowError(false);
    onDismiss();
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !showError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleErrorClose}
      />
      {error}
    </div>
  );
};
