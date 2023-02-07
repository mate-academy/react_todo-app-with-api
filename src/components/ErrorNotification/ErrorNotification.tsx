import { memo } from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string;
  setErrorMessage: (message: string) => void;
};

export const ErrorNotification: React.FC<Props> = memo(({
  errorMessage, setErrorMessage,
}) => {
  if (errorMessage) {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
      />
      {errorMessage}
    </div>
  );
});
