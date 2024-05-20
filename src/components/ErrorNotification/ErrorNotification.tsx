import { FC } from 'react';
import { useErrorNotification } from '../../hooks';

export const ErrorNotification: FC = () => {
  const { errorMessage, setErrorType } = useErrorNotification();

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${!errorMessage ? 'hidden' : ''}`}
    >
      {errorMessage}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorType(null)}
      />
    </div>
  );
};
