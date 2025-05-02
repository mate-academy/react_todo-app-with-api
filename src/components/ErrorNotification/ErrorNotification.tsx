import classNames from 'classnames';
import React from 'react';

type Props = {
  errorMessage: string | null;
  isHidden: boolean;
  onHide: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  isHidden,
  onHide,
}) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: isHidden },
    )}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={onHide}
    />
    {errorMessage}
  </div>
);
