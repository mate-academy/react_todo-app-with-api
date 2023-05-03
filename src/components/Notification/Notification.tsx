/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';
import { Errors } from '../../types/Errors';

type Props = {
  isError: boolean;
  typeOfError: Errors | null;
  removeNotification: () => void;
};

export const Notification: React.FC<Props> = ({
  isError,
  typeOfError,
  removeNotification,
}) => {
  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !isError },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={removeNotification}
      />

      { typeOfError
        ? typeOfError[0].toUpperCase() + typeOfError.slice(1).toLowerCase()
        : ''}
    </div>
  );
};
