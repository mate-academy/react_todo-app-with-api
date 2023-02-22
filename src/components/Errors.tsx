import React from 'react';
import classNames from 'classnames';

import { Error } from '../types/Error';

type Props = {
  errorMessage: Error,
  errorVisibility: boolean
  onHidden: (visibility: boolean) => void,
};

export const Errors: React.FC<Props> = ({
  errorMessage,
  errorVisibility,
  onHidden,
}) => {
  const onCloseClick = () => {
    onHidden(true);
  };

  if (!errorVisibility) {
    setTimeout(() => {
      onHidden(true);
    }, 3000);
  }

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorVisibility },
      )}
    >
      <button
        type="button"
        className="delete"
        aria-label="Close error"
        onClick={onCloseClick}
      />

      {errorMessage}
    </div>
  );
};
