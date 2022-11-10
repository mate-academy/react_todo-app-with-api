import React from 'react';
import cn from 'classnames';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  error: ErrorType;
  closeErrorMassege: () => void;
};

export const ErrorNotification: React.FC<Props> = React.memo(({
  error,
  closeErrorMassege,
}) => (
  <div
    data-cy="ErrorNotification"
    className={cn(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: error === ErrorType.NONE },
    )}
  >
    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={closeErrorMassege}
    />

    {error}
  </div>
));
