import { useEffect, useRef } from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  error: ErrorMessage,
  setError: (error: ErrorMessage) => void,
};

export const ErrorNotification: React.FC<Props> = (props) => {
  const { error, setError } = props;
  const timerRef = useRef<NodeJS.Timer>();

  useEffect(() => {
    if (error !== ErrorMessage.None) {
      timerRef.current = setTimeout(() => {
        setError(ErrorMessage.None);
      }, 3000);
    } else {
      clearTimeout(timerRef.current);
    }
  }, [error]);

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        aria-label="HideError"
        className="delete"
        onClick={() => setError(ErrorMessage.None)}
      />
      {error}
    </div>
  );
};
