import React, { useEffect, useState } from 'react';

interface Props {
  hasError: string;
}

export const ErrorNotification: React.FC<Props> = (props) => {
  const { hasError } = props;
  const [hideError, setHideError] = useState(true);

  useEffect(() => {
    if (hasError.length > 1) {
      setHideError(false);
    }

    if (hasError.length < 1) {
      setHideError(true);
    }
  }, [hasError]);

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
      hidden={hideError}
    >

      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => (
          setHideError(true)
        )}
      />
      {hasError}
    </div>
  );
};
