import { ErrorMessages } from '../../types/ErrorMessages';
import { useEffect } from 'react';

type Props = {
  error: ErrorMessages | null;
  onHandleHideError: () => void;
};

export const ErrorNote: React.FC<Props> = ({ error, onHandleHideError }) => {
  useEffect(() => {
    let timerId = 0;

    if (error) {
      timerId = window.setTimeout(() => onHandleHideError(), 3000);
    }

    return () => clearTimeout(timerId);
  }, [error, onHandleHideError]);
  // console.log('erroreNote', !error);

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
      style={{ display: error ? 'block' : 'none' }}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onHandleHideError}
      />
      {error}
    </div>
  );
};
