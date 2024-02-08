import { Dispatch, SetStateAction } from 'react';
import { ErrorTypes } from '../types/ErrorTypes';
import { handleErrorText } from '../helpers/handleErrorText';

type Props = {
  error: ErrorTypes,
  setError: Dispatch<SetStateAction<ErrorTypes | null>>,
};

export const ErrorComponent: React.FC<Props> = ({ error, setError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Error Notification"
        onClick={() => setError(null)}
      />
      {handleErrorText(error)}
    </div>
  );
};
