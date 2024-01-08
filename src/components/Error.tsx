/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { FC, memo } from 'react';

interface Props {
  errorMessage: string;
  closeErrorMessage: () => void;
}

export const Error: FC<Props> = memo(({
  errorMessage,
  closeErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={closeErrorMessage}
      />
      {errorMessage}
    </div>
  );
});
