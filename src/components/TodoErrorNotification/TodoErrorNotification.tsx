/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect } from 'react';

type Props = {
  error: string | null,
  setError: (value: string | null) => void;
};

export const TodoErrorNotification: React.FC<Props> = ({
  error,
  setError,
}) => {
  useEffect(() => {
    const timer = window.setTimeout(() => setError(null), 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [error]);

  return (
    <>
      {error && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setError(null)}
          />
          {error}
        </div>
      )}
    </>
  );
};
