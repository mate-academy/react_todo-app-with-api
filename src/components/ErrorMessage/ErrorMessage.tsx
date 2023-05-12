/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useEffect } from 'react';

interface Props {
  errorMessage: string | null;
  onSetErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;

}

export const ErrorMessage: React.FC<Props> = React.memo(({
  errorMessage,
  onSetErrorMessage,
}) => {
  const handleErrorMessage = () => {
    onSetErrorMessage('');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onSetErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  return (
    <div
      className={
        classNames('notification is-danger is-light has-text-weight-normal', {
          hidden: !errorMessage,
        })
      }
    >
      <button
        type="button"
        className="delete"
        onClick={handleErrorMessage}
      />

      {errorMessage}

    </div>
  );
});
