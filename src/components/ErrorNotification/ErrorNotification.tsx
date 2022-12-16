/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';

type Props = {
  isError: boolean
  onSetIsError: React.Dispatch<React.SetStateAction<boolean>>
  typeError: string
};

export const ErrorNotification: React.FC<Props> = ({
  isError,
  onSetIsError,
  typeError,
}) => {
  const timeReference = useRef<NodeJS.Timer>();

  useEffect(() => {
    if (isError) {
      timeReference.current = setTimeout(() => {
        onSetIsError(false);
      }, 3000);
    } else {
      clearTimeout(timeReference.current);
    }
  }, [isError]);

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
      hidden={!isError}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onSetIsError(false)}
      />

      {isError && <>{typeError}</>}
    </div>
  );
};
