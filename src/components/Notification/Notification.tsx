import React from 'react';
import classNames from 'classnames';

type Props = {
  hasError: boolean,
  errorMessage: string,
  onHasError: (hasError: boolean) => void,
};

export const Notification: React.FC<Props> = ({
  hasError,
  errorMessage,
  onHasError,
}) => (
  <div className={classNames(
    'notification is-danger is-light has-text-weight-normal',
    { hidden: !hasError },
  )}
  >

    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
    <button
      type="button"
      className="delete"
      onClick={() => onHasError(false)}
    />

    {errorMessage}
  </div>
);
