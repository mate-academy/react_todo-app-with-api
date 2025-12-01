import React from 'react';
import cn from 'classnames';
import { ErrorTypes } from '../types/ErrorTypes';

type Props = {
  error: ErrorTypes | null;
  isVisible: boolean;
  onHide: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  error,
  isVisible,
  onHide,
}) => (
  <div
    data-cy="ErrorNotification"
    className={cn('notification is-danger is-light has-text-weight-normal', {
      hidden: !isVisible,
    })}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={onHide}
    />
    {error}
  </div>
);
