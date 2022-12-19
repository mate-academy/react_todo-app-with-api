import React, { useEffect } from 'react';
import { ErrorText } from '../../types/ErrorText';

interface Props {
  errorText: string,
  onSetErrorText: (Error: ErrorText) => void,
}
export const ErrorNotification: React.FC<Props> = React.memo(({
  onSetErrorText,
  errorText,
}) => {
  let timer: NodeJS.Timer;

  useEffect(() => {
    if (errorText !== ErrorText.None) {
      timer = setTimeout(() => onSetErrorText(ErrorText.None), 3000);
    }
  }, [errorText]);

  return (
    <div
      hidden={errorText === ErrorText.None}
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          onSetErrorText(ErrorText.None);
          clearTimeout(timer);
        }}
      />
      {errorText}
    </div>
  );
});
