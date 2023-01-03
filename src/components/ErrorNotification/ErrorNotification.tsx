/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';
import { Errors } from '../../types/Errors';

type Props = {
  onSetTypeError: React.Dispatch<React.SetStateAction<Errors>>
  typeError: Errors
};

export const ErrorNotification: React.FC<Props> = ({
  onSetTypeError,
  typeError,
}) => {
  const timeReference = useRef<NodeJS.Timer>();

  useEffect(() => {
    if (typeError) {
      timeReference.current = setTimeout(() => {
        onSetTypeError(Errors.ErrNone);
      }, 3000);
    } else {
      clearTimeout(timeReference.current);
    }
  }, [typeError]);

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
      hidden={!typeError}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onSetTypeError(Errors.ErrNone)}
      />

      {typeError && <>{typeError}</>}
    </div>
  );
};
