import React, { memo, useEffect } from 'react';
import classnames from 'classnames';

type Props = {
  error: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
};

export const ErrorNotification: React.FC<Props> = memo((props) => {
  const { error, setErrorMessage } = props;

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  });

  return (
    <div
      data-cy="ErrorNotification"
      className={classnames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {error}
    </div>
  );
});
